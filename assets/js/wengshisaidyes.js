// ------------------------------------------------------------------
// Pane Opening and Closing
// ------------------------------------------------------------------
var rsvp = $( " #link-rsvp " );
let resizeTimer;

$( window ).resize(function() {
    slider = $( ".slider" );
    slider.addClass("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        slider.removeClass("resize-animation-stopper");
    }, 100);
});

rsvp.click(function() {
    nav = $( "#navigation-bar" );
    parallax = $( "#parallax-container" );
    pane = $( "#rsvp-pane" );

    // Change location
    nav.toggleClass( "slide" );
    parallax.toggleClass( "slide" );
    pane.toggleClass( "slide-pane" );

    // Set correct form state (entering/sent)
    $( "#submit-form" ).val('✉ Send');
    if ($( "#form-wrapper").hasClass( "fieldset-hidden-in-the-html" ) && !pane.hasClass( "slide-pane" ))  {
        //im too lazy to do the right logic
    } else {
        $( ".field-wrapper" ).toggleClass( "fieldset-hidden-in-the-html" );
    }

    rsvp.toggleClass( "rolled-over" );
});

// ------------------------------------------------------------------
// Scroll handling
// ------------------------------------------------------------------
var scrolling = {
    behavior: "smooth"
};

$( "#parallax-container" ).scrollTop(0);
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
        input.removeClass( "empty" );
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

    select.width( width + 8 ); //8px is the padding Firefox gives to option elements

    if ( select.is( "#guest-sur" ) ) {
        if ( option.val() == "Yes" ) {
            $( "#guest-field" ).removeClass( "fieldset-hidden-in-the-html" );
        } else {
            $( "#guest-field" ).addClass( "fieldset-hidden-in-the-html" );
        }
    }

    // Decision handling, we are assuming binary decisions
    // decision = select.next().filter( ".decision" );
    // if (decision.length > 0) {
        // choices = decision.children().filter( ".choice" );
        // if (!choices.hasClass( "chosen" )) {
        //     choices.first().addClass( "chosen" );
        // } else {
        //     choices.toggleClass( "chosen" );
        // }
    // }
    choice = select.next().filter(".choice");
    if (!choice.hasClass( "chosen" )) {
        choice.addClass( "chosen" )
    } else {
        choice.toggleClass( "chosen" ).next().toggleClass( "chosen" );
    }

    if (select.attr("edited") == "false") {
        select.attr("edited", "true");
    }
});

// Trigger change at least once on each to set width and initial decision
$( "select" ).each(function() {
    select = $( this );
    select.change();
    //input.keyup();
    select.attr("edited", "false");
});

// Set all the default options to hidden; still rendered as initial value
$( "option.select-default" ).prop("hidden", true);

// Form event
$( "#submit-form" ).on('click', function(e) {
    e.preventDefault();

    $( "#submit-form" ).val('...');
    //$( "#rsvp fieldset" ).prop("disabled", true);
    $( "#form-wrapper" ).toggleClass( "fieldset-lurking" );

    $( "#name" ).val( $( "#name-sur" ).text() );
    $( "#entree" ).val( $( "#entree-sur" ).val() );
    $( "#diet" ).val( $( "#diet-sur" ).val());
    $( "#restrictions" ).val( $( "#restrictions-sur" ).text() );
    $( "#guest" ).val( $( "#guest-sur" ).val() );
    $( "#guest-name" ).val( $( "#guest-name-sur" ).text() );
    $( "#guest-entree" ).val( $( "#guest-entree-sur" ).val() );
    $( "#guest-diet" ).val( $( "#guest-diet-sur" ).val() + $( "#guest-diet-sur-details" ).text() );
    $( "#guest-restrictions" ).val( $( "#guest-restrictions-sur" ).text() );
    $( "#song" ).val( $( "#song-sur" ).text() );

    $( "input[type='text']" ).each(function() {
      console.log($( this ).val());
    });

    var jqxhr = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        data: $form.serializeObject()
    }).done( function() {
        // this does not validate success!
        $( ".field-wrapper" ).toggleClass( "fieldset-hidden-in-the-html" );
        $( "#form-wrapper" ).toggleClass( "fieldset-lurking" );
        //$( "#rsvp fieldset" ).prop("disabled", false);
        $( "#submit-form" ).val('✔');
    });
});

$( '.close' ).click(function(e) {
    rsvp.click();
});
