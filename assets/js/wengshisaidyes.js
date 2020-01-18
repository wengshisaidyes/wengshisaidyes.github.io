// ------------------------------------------------------------------
// Column'd Content from Markdown
// ------------------------------------------------------------------
swiper = $( ".swipe-text" ) //no swiping!
swiper.children( "h4" ).each(function() {
    //add div at dom
    //move h4 and following p to div
    h4 = $( this ).before( "<div></div>");
    section = h4.prev().addClass( "keep-together" );
    p = h4.nextUntil( "h4" ).filter( "p" );
    div = h4.nextUntil("h4").filter( "div" )
    section.append( h4 ).append( p ).append( div );
});

swiper.each(function() {
    swipe = $( this );
    swipe.clone().removeClass("swipe-text").addClass("swipe-text-shadow").insertBefore( swipe );
});

// ------------------------------------------------------------------
// Pane Opening and Closing
// ------------------------------------------------------------------
var rsvp = $( " #link-rsvp " );
let resizeTimer;

$( window ).resize(function() {
    //slider = $( ".slider" ); // Possible way of solving the transition problem on resize
    //slider.addClass("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        //slider.removeClass("resize-animation-stopper");
        $( ".swipe-text-shadow" ).each(function() {
            shadow = $( this );
            swipe = shadow.parent();
            if (shadow.height() > swipe.height()) {
                swipe.addClass( "swipe-on" );
                shadow.addClass( "snap" );
            } else {
                swipe.removeClass( "swipe-on" );
                shadow.removeClass( "snap" );
            }
        });
    }, 100);
});

$( window ).resize();

// ------------------------------------------------------------------
// Scroll handling
// ------------------------------------------------------------------
var scrolling = {
    behavior: "smooth"
};

//$( "#parallax-container" ).scrollTop(0);
$(".background div[snap]" ).addClass("snap");

links = $( ".link" );
links.click(function() {
    rsvp.hasClass( "rolled-over" ) ? rsvp.click() : null;
    link = $( this );
    links.removeClass("scroll-to");
    link.addClass("scroll-to");
    snap = "#snap-".concat(link.attr("snap"));
    document.querySelector(snap).scrollIntoView(scrolling);
});

var container = $( "#parallax-container" );
var height = container.height()
var waiting = false, endScroll;

var scroll = function() {
    var pos = container.scrollTop(); //CSS scroll snapping gives us the correct location
    var target = $( ".snap" ).eq( Math.round( pos / height ) ).attr("snap");
    target == "when" ? rsvp.addClass("highlight") : rsvp.removeClass("highlight");
    links.removeClass("scroll-to");
    links.each(function() {
        link = $( this );
        if (link.attr("snap") == target) {
            link.addClass("scroll-to");
            return false;
        }
    });
}

container.scroll(function() {
    if (waiting) {
        return;
    }
    waiting = true;
    clearTimeout(endScroll);

    setTimeout(function() {
        waiting = false;
    }, 50);

    endScroll = setTimeout(function() {
        scroll();
    }, 100);
});

// ------------------------------------------------------------------
// Form handling
// ------------------------------------------------------------------
var ch = $( "#__ch" ).width();
var $form = $(" form#rsvp "),
  url = 'https://script.google.com/macros/s/AKfycbxriZbi9EzPKoKhFI2wzsQDS93Jn7CqIIiNMFhQ1Y8dbrLl-o4/exec'

  rsvp.click(function() {
      var nav = $( "#navigation-bar" );
      var parallax = $( "#parallax-container" );
      var pane = $( "#rsvp-pane" );

      // Change location
      nav.toggleClass( "slide" );
      parallax.toggleClass( "slide" );
      pane.toggleClass( "slide-pane" );

      // Set correct form state (entering/sent)
      $( "#submit-form" ).val('✉ Send').prop("disabled", false);
      if ($( "#form-wrapper").hasClass( "fieldset-hidden-in-the-html" ))  {
          $( "#form-wrapper").removeClass( "fieldset-hidden-in-the-html" );
      }

      $( "#form-accept" ).addClass( "fieldset-hidden-in-the-html" );
      $( "#form-decline" ).addClass( "fieldset-hidden-in-the-html" );
      rsvp.toggleClass( "rolled-over" );
  });

// Add default text (we dont have placeholder for spans); all dom elements are loaded here (theoretically?)
$( "span[contenteditable='true']" ).each( function() {
    input = $( this );
    input.text( input.attr("default"));
    input.attr("edited", "false");
});

// Span input handling
// On the way in we remove the contents if its default...
$( "span[contenteditable='true']" ).click(function(e) {
    input = $( this );
    if (input.attr("edited") == "false") {
        input.text("");
        input.attr("edited", "true");
        input.keyup();
    }
});

// Need to differentiate between a focus-on-click and from tab
// IF we click the span, and trigger a focus event followed by a click event,
//  in Chrome it appears that the final click event will not fire (and give focus to the element)
//  if the element isn't in the same spot (i.e. its width changed due to changing text())
//  so we have to let the original click event resolve (i.e let that event change the text)
$( "span[contenteditable='true']" ).mousedown(function(e) {
    target = e.target;
}).focus(function(e) {
    input = $( this );
    if (typeof target === "undefined") {
        target = false;
    }
    if (target != e.target) {
        if (input.attr("edited") == "false") {
            input.text("");
            input.attr("edited", "true");
            input.keyup();
        }
    }
});

// Handle enter; we only want form submit from clicking "Send"
$( "span[contenteditable='true']" ).keydown(function(e) {
    if (e.which == 13) {
        e.preventDefault();
        e.stopPropagation();
        $( this ).blur();
    }
});

// This will handle empty text inputs
$( "span[contenteditable='true']" ).keyup(function(e) {
    input = $( this );
    if (input.text().length < 1) {
        input.addClass( "empty" );
    } else {
        input.removeClass( "empty" ).removeClass("required");
    }
});

// This handles restoring default text
$( "span[contenteditable='true']" ).blur(function() {
    input = $( this );
    if (input.text() == "") {
        input.attr("edited", "false");
        input.text( input.attr("default") );
        input.keyup();
    }
    // return to default (edited == false) if empty on blur
    // also remove space emulating min-width = 2ch

});

// Select resizing and decision text handling
$( "select" ).change(function() {
    select = $( this );
    realm = $( "#shadow-realm" );
    option = select.children( "option:selected" );

    shadow = $( "<span>" ).html(option.text()).appendTo( realm );
    width = shadow.width();
    shadow.remove();

    select.width(width+8); //8px is the padding Firefox gives to option elements

    choice = select.next().filter(".choice");

    // Initial select.change() sets up edited property and choice
    // Next select.change() sets to edited state
    if (typeof select.attr("edited") == "undefined") {
        choice.addClass( "chosen" );
        select.attr("edited", "false");
    } else {
        select.attr("edited", "true");
    }

    // If in edited state, we can swap choices and/or smoke-bomb (eg #guest-sur does both)
    if (select.attr("edited") == "true") {
        choice.toggleClass( "chosen" ).next().toggleClass( "chosen" );
        if ( select.is( ".smoke-bomb" ) ) {
            nextFieldset = select.siblings("fieldset");
            nextFieldset.toggleClass( "fieldset-hidden-in-the-html" );
        }
    }
});

// Trigger change at least once on each to set width and initial decision
$( "select" ).each(function() {
    $( this ).change();
});

// Set all the default options to hidden; still rendered as initial value
$( "option.select-default" ).prop("hidden", true);

// Form event
$( "#submit-form" ).on('click', function(e) {
    e.preventDefault();
    submit = $( "#submit-form" );
    submit.prop("disabled", true);
    var form = $( "#form-wrapper" );

    // Set the values of the submission input set
    submission = $( "#shadow-realm" ).children( "input" );
    submission.each( function() {
        var input = $( this );
        var source = $( "#" + input.attr("id") + "-sur" );
        var invisible_flag = source.parentsUntil( "#form-wrapper" ).is( ".fieldset-hidden-in-the-html" );
        var not_chosen_flag = source.parentsUntil( "fieldset" ).is( ".chosen" ) || source.parentsUntil( "fieldset" ).length == 0;
        var value = "";
        if (!invisible_flag && not_chosen_flag) {
            var defaultText;
            if (source.is( "select" )) {
                value = source.val();
                defaultText = source.children("option[selected=selected]").text();
                // We don't need the rest of the entries if declined
                if (value == "regretfully decline") { //Checking exact value of select is not robust!
                    input.val( false );
                    return false;
                }
                if (value == defaultText) {
                    value == "am happy to accept" ? value = true : value = ""; // Wierd case where we want to send default except in this case
                } else {
                    value == "Yes" ? value = true
                  : value == "No" ? value = false
                  : value = value;
                }
            } else if (source.is( "span" )) {
                value = source.text();
                defaultText = source.attr("default");
                if (value == defaultText) {
                    value = "";
                } else if (value.charAt(0) == '=') {
                    value = "FUNCTION ATTEMPT";
                }
            }
        }
        input.val( value );
    });

    // We need code here to redirect the user to fill fields that arent full, or have bad inputs
    // Input validation also needs to go here; currently the above just handles defaults
    var required_flag = false;
    submission.filter( "input[required]" ).each(function() {
        input = $( this );
        if (input.val() == "") {
            $( "#" + input.attr("id") + "-sur" ).addClass("required");
            required_flag = true;
        }
    });

    if (required_flag) {
        submit.val('Try Again :(').prop("disabled", false).addClass("required"); // Get back to work!
    } else {
        submit.val('...');
        form.addClass( "fieldset-lurking" );
        var jqxhr = $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: $form.serializeObject()
        }).done( function() {
            submit.val('✔');
            form.addClass( "fieldset-hidden-in-the-html" );
            if ($( "#accept" ).val() == "false") {
                $( "#form-decline" ).removeClass( "fieldset-hidden-in-the-html" );
            } else {
                $( "#form-accept" ).removeClass( "fieldset-hidden-in-the-html" );
            }
            form.removeClass( "fieldset-lurking" );
            //$( "#rsvp fieldset" ).prop("disabled", false);
        });
    }
});

$( '.close' ).click(function(e) {
    rsvp.click();
});
