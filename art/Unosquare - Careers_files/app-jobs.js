var SkillTemplate = "",
    ExperienceTemplate = "",
    CertificationTemplate = "";
var FocusableElements = new Array();
var ValidationFunctions = new Array("PersonalInformationIsComplete", "SkillsAreComplete", "ExperienceIsComplete");
var Pages = null,
    JobsPerPage = null,
    TotalPages = null;

$(document).ready(function() {
    $(".step").each(function() {
        FocusableElements.push($(this).find("input[type='text'], input[type='file'], button, textarea, select, a"))
    });
    if (/Android/.test(navigator.appVersion) && /Chrome/.test(navigator.appVersion)) {
        window.addEventListener("resize", function() {
            if (document.activeElement.tagName == "INPUT") {
                window.setTimeout(function() {
                    document.activeElement.scrollIntoView(false);
                }, 0);
            }
        })
    }
    // Initialize the Page's variables
    Pages = $(".page");
    JobsPerPage = parseInt($("#jobs_per_page").val());
    TotalPages = parseInt($("#total_pages").val());
    //Event handlers for the dialogs
    $("#cont-applyprocess").on("shown.bs.modal", function(e) {
        FocusableElements.forEach(function(Elements, Index) {
            if (Index > 0) {
                Elements.attr("tabIndex", "-1")
            }
        });
        $("body").css("overflow", "hidden").css("padding-right", "17px");
        CalculateDialogDimensions();
    }).on("hidden.bs.modal", function(e) {
        $("body").css("overflow", "").css("padding-right", "");
        ResetApplyForAJob();
    });
    $("#cont-sendresume").on("shown.bs.modal", function(e) {
        $("body").css("overflow", "hidden").css("padding-right", "17px");
        CalculateDialogDimensions();
    }).on("hidden.bs.modal", function(e) {
        $("body").css("overflow", "").css("padding-right", "");
        ResetSendResume();
    });
    $("*[data-regexp]").keyup(function() {
        var regex = new RegExp($(this).attr("data-regexp"));
        if (this.value.match(regex))
            this.value = this.value.replace(regex, '');
    });
    $('#cd_resume_file').on("change", function() {
        var fname = $("#cd_resume_file");
        var lblfname = $("#cd_resume_label");
        if (!fileupload_validation(fname, lblfname)) {
            $("#cd_resume_label").html(fname.val());
        }
    });
    $('#send_resume_file').on("change", function() {
        var fname = $(this);
        var lblfname = $("#send_resume_label");
        if (fileupload_validation(fname, lblfname)) {
            $("#send_resume_label").html(fname.val());
        } else {
            console.log(fname)
        }
    });
});

function upToHeader() {
    $('body,html').animate({
	    scrollTop: $('#headerJobs').offset().top
	    }, 800
    );
}
// Move between pages
function MoveToNextPage(NextPage) {
    var CurrentPage = parseInt($("#list-jobs").attr("data-current-page"));

    if (isNaN(NextPage)) {
        eval("CurrentPage" + NextPage);
    }
    $(".positions-container").attr("data-first-page", (CurrentPage == 1).toString());
    $(".positions-container").attr("data-last-page", (CurrentPage == TotalPages).toString());
    $("#list-jobs").attr("data-current-page", CurrentPage);
    if (CurrentPage == eval(TotalPages + 1)) {
        $('.next-page').hide();
    } else {
        $(".next-page").show();
    }
    Pages.each(function(Index, Page) {
        $(Page).css("left", (Index - (CurrentPage - 1)) * 100 + "%");
    })
    upToHeader();
    var totalJobs = $("#dattotpag").data('total');
    var jobToNumber = (CurrentPage) * JobsPerPage;
    if (jobToNumber > totalJobs) {
        jobToNumber = totalJobs;
    }
    $(".job-from").text((CurrentPage - 1) * JobsPerPage + 1);
    $(".job-to").text(jobToNumber);
}
// Move to the next step
function MoveNextStep() {
    var CurrentStep = parseInt($("#dat_current_step").html());
    var InfoIsComplete = true;
    if (CurrentStep < 4) {
        InfoIsComplete = window[ValidationFunctions[CurrentStep - 1]]();
    }
    if (!InfoIsComplete) {
        return;
    }
    $("#dat_current_step").html(CurrentStep + 1);

    $("#form_apply .step").each(function(Index, Step) {
        Step = $(Step);
        FocusableElements.forEach(function(Elements, Index) {
            if (Index != CurrentStep) {
                Elements.attr("tabIndex", "-1")
            } else {
                Elements.removeAttr("tabIndex")
            }
        });
        var NewLeft = (parseInt(CurrentStep - Index) * (-100)) + "%";
        Step.css({
            left: NewLeft
        });
    });

    $("#cont-applyprocess").attr("data-current-step", CurrentStep + 1);
    //.attr("tabIndex", "-1").hide();
}
// Move to the prior step
function MovePriorStep() {
    var BackStep = parseInt($("#dat_current_step").html()) - 1;
    $("#dat_current_step").html(BackStep);

    FocusableElements.forEach(function(Elements, Index) {
        if (Index != (BackStep - 1)) {
            Elements.attr("tabIndex", "-1")
        } else {
            Elements.removeAttr("tabIndex")
        }
    });

    $("#form_apply .step").each(function(Index, Step) {
        Step = $(Step);
        var NewLeft = (parseInt(BackStep - (Index + 1)) * (-100)) + "%";
        Step.css({
            left: NewLeft
        });
    });
    $("#cont-applyprocess").attr("data-current-step", BackStep);
    $("*[data-title]").tooltip("hide");
}
// Validate the personal information
function PersonalInformationIsComplete() {
    var Errors = false;
    $("#cdpi_name, #cdpi_last_name, #cdpi_telephone").each(function() {
        if ($(this).val().length < 3) {
            $(this).tooltip("show");
            Errors = true;
        }
    });
    var Email = $("#cdpi_email");
    var EmailPattern = /^[a-zA-Z0-9._]+[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if (!EmailPattern.test(Email.val())) {
        Email.tooltip("show");
        Errors = true;
    }
    return !Errors;
}
// Validate skills
function SkillsAreComplete() {
    var Errors = false;
    $("select[name^='cdt_tskill'], select[name^='cdt_tskill_years'], select[name^='cdt_tskill_level']").each(function() {
        if ($(this).val() <= -1) {
            $(this).tooltip("show");
            Errors = true;
        }
    });
    return !Errors;
}
// Validate experience
function ExperienceIsComplete() {
    var Errors = false;
    $("input[name^='cdex_cmpyname'], input[name^='cdex_jobtitle'], input[name^='cdex_period'], textarea[name^='cdex_descrip']").each(function() {
        if ($(this).val() == "" || $(this).val().length < 3) {
            $(this).tooltip("show");
            Errors = true;
        }
    });
    return !Errors;
}
//Validate Certifications
function CertificationsAreComplete() {
    var Errors = false;
    $("input[name^='cdcert_name'], input[name^='cdcert_where'], input[name^='cdcert_period']").each(function() {
        if ($(this).val() == "" || $(this).val().length < 3) {
            $(this).tooltip("show");
            Errors = true;
        }
    });
    return !Errors;
}

function fileupload_validation(objfile, objlbl) {
    var filename = objfile.val();
    var Errors = false;
    var extension = filename.toLowerCase().replace(/^.*\./, '');
    extension = (extension == filename ? '' : extension);

    if (extension == "doc" || extension == "docx" || extension == "pdf" || extension == "txt") {
        Errors = false;
        try {
            objlbl.tooltip("close");
        } catch (e) {
            //
        }
    } else {
        objlbl.tooltip("show");
        Errors = true;
        objfile.val("");
        objlbl.html("No file selected");
    }
    return !Errors;
}

function IsResumeInfoComplete() {
    var Errors = false;
    $("#snre_name, #snre_last_name,  #snre_telephone").each(function() {
        if ($(this).val().length < 3) {
            $(this).tooltip("show");
            Errors = true;
        }
    });
    var Email = $("#snre_email");
    var EmailPattern = /^[a-zA-Z0-9._]+[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    if (!EmailPattern.test(Email.val())) {
        Email.tooltip("show");
        Errors = true;
    }
    return !Errors;
}
// Add Skill
function AddSkill() {
    if (!SkillsAreComplete()) {
        return
    }
    var Rows = $("ul#skills li");
    $(SkillTemplate.replace(/_INDEX/g, "_" + (Rows.length + 1))).attr("class", "clear-fix").insertAfter(Rows.eq(Rows.length - 1));
    init_tooltip_input();
}
//Show "Delete" button for Skills
$("select[name^='cdt_tskill'], select[name^='cdt_tskill_years'], select[name^='cdt_tskill_level']").on("change", function() {
    var This = $(this);
    if (This.val() <= -1) {
        This.parent().removeClass(This.attr("id").replace(/_\d/g, ""));
    } else {
        This.parent().addClass(This.attr("id").replace(/_\d/g, ""));
    }
}).trigger("change");
// Delete skills
$("ul#skills li div.del-ico").on("click", function() {
    $(this).parents("li").remove();
    $("ul#skills li").each(function(Index, Skill) {
        $("select", $(Skill)).each(function() {
            var This = $(this);
            This.attr("id", This.attr("id").replace(/_\d/g, "_" + (Index + 1)));
        });
    });
});
// Add Experience
function AddExperience() {
    if (!ExperienceIsComplete()) {
        return;
    }
    var Rows = $("ul.experience ");
    $(ExperienceTemplate.replace(/_INDEX/g, "_" + (Rows.length + 1))).attr("class", "experience").insertAfter(Rows.eq(Rows.length - 1));
    init_tooltip_input();
}
//Show "Delete" button for Experience
$("input[id^='cdex_cmpyname'], input[id^='cdex_jobtitle'], input[id^='cdex_period'], textarea[id^='cdex_descrip'], input[id^='cdcert_name'], input[id^='cdcert_where'], input[id^='cdcert_period']").on("keyup change", function() {
    var This = $(this);
    if (This.val().length < 3) {
        This.parents("ul").removeClass(This.attr("id").replace(/_\d/g, ""));
    } else {
        This.parents("ul").addClass(This.attr("id").replace(/_\d/g, ""));
    }
}).trigger("change");
//Delete experience
$("ul.experience li div.del-ico").on("click", function() {
    $(this).parents("ul").remove();
    $("ul.experience").each(function(Index, Experience) {
        $("input,textarea", $(Experience)).each(function() {
            var This = $(this);
            This.attr("id", This.attr("id").replace(/_\d/g, "_" + (Index + 1)));
        });
    });
});
// Add Certification
function AddCertification() {
    if (!CertificationsAreComplete()) {
        return;
    }
    var Rows = $("ul.certification");
    $(CertificationTemplate.replace(/_INDEX/g, "_" + (Rows.length + 1))).attr("class", "certification").insertAfter(Rows.eq(Rows.length - 1));
    init_tooltip_input();
}
// Delete Certification
$("ul.certification li div.del-ico").on("click", function() {
    $(this).parents("ul").remove();
    $("ul.certification").each(function(Index, Certification) {
        $("input", $(Certification)).each(function() {
            var This = $(this);
            This.attr("id", This.attr("id").replace(/_\d/g, "_" + (Index + 1)));
        });
    });
});

function CalculateDialogDimensions(event) {
    var Modal = $(".modal");
    var Form = Modal.find("form");

    $(window).resize(function() {
        var FixHeight = 0;
        Modal.find(".fix-section").each(function(Index, Section) {
            FixHeight += $(Section).height();
        });
        FixHeight += (Modal.outerHeight() - Modal.height());

        Modal.css("height", "auto");
        Form.css("height", "auto");
        var AvailableHeight = parseInt($(window).height() * 0.9);
        Modal.css({
            "height": AvailableHeight - 10 + "px",
            "margin-left": "-" + (Modal.outerWidth() / 2) + "px"
        });
        Form.css({
            "height": (AvailableHeight - (FixHeight + 14)) + "px"
        }).find(".center-vertically").each(function() {
            $(this).css("margin-top", "-" + parseInt($(this).height() / 2) + "px");
        });
    }).trigger("resize");
}

function UpdateProgressBar(Progress) {
    var Percentage = Math.round(Progress.loaded / Progress.total * 100) + "%";
    $(".progress-bar .progress").css("width", Percentage);
    $(".progress-bar .percentage").html(Percentage);
}

// Show the "Apply for a job" dialog
function setPositionName(JobId) {
    var JobInfo = $("#jobid" + JobId);
    $("#txt_jobName").val($(".job-header>p", JobInfo).text());
    $("#isPosition").show();
    $("#isResume").hide();
    $("#isPosition .modal-job-category").text($(".job-category", JobInfo).text());
    $("#isPosition .job-header").html($(".job-header", JobInfo).html())
    $("#cont-sendresume").modal("show");
}

function applyResume() {
    $("#txt_jobName").val('');
    $("#isPosition").hide();
    $("#isResume").show();
    $("#cont-sendresume").modal("show");
}
// Send the resume
function SendResume() {
    var apiUrl = 'api/sendresume.php';
    if (!IsResumeInfoComplete()) {
        return;
    }
    if ($("#txt_jobName").val() != '') {
        apiUrl = 'api/apply.php';
    }
    var formData = new FormData($("#form_send_resume")[0]);
    var file = $('#send_resume_file')[0].files[0];
    formData.append('#send_resume_file', file);
    $("#cont-sendresume").attr("data-current-step", 2);
    $("#form_send_resume .step2").css({
        opacity: 1
    });
    $("#form_send_resume .step").each(function(Index, Step) {
        Step = $(Step);
        var NewLeft = (parseInt((Index - 1)) * (+100)) + "%";
        Step.css({
            left: NewLeft
        });
    });
    $.ajax({
        url: apiUrl,
        type: 'POST',
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total * 100;
                    UpdateProgressBar(evt);
                }
            }, false);
            xhr.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total * 100;
                    UpdateProgressBar(evt);
                }
            }, false);
            return xhr;
        },
        success: function() {
            $("#form_send_resume .step2").css({
                opacity: 0
            });
            $("#form_send_resume .step3").css({
                left: 0,
                opacity: 1
            });
        },
        error: function(a, b, c) {
            $("#form_send_resume .step2").css({
                opacity: 0
            });
            $("#form_send_resume .step4").css({
                left: 0,
                opacity: 1
            });
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    });
}
// Reset the "Send resume" dialog
function ResetSendResume() {
    $("#form_send_resume").trigger("reset").find(".step").each(function() {
        $(this).css({
            left: ""
        });
    });
    $("#cont-sendresume").attr("data-current-step", 1);
    $("*[data-title]").tooltip("hide");
    $("#send_resume_label").html("No file selected");
}