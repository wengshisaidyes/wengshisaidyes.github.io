var rsvp = $( " #link-rsvp " );
var scrolling = {
    behavior: "smooth"
};
var ch = $( "#__ch" ).width();
console.log(ch);
var $form = $(" form#rsvp "),
  url = 'https://script.google.com/macros/s/AKfycbxriZbi9EzPKoKhFI2wzsQDS93Jn7CqIIiNMFhQ1Y8dbrLl-o4/exec'

rsvp.click(function() {
    $( "#navigation-bar" ).toggleClass( "slide" );
    $( "#parallax-container" ).toggleClass( "slide" );
    pane = $( "#rsvp-pane" ).toggleClass( "slide-pane" );
    $( "#submit-form" ).val('✉ Send');
    if ($( "#form-wrapper").hasClass( "fieldset-hidden-in-the-html" ) && !pane.hasClass( "slide-pane" ))  {
        //im too lazy to do the right logic
    } else {
        $( ".field-wrapper" ).toggleClass( "fieldset-hidden-in-the-html" );
    }
    rsvp.toggleClass( "rolled-over" );
});


// Link scroll-to effects ---------------------------------------------

$( "#link-when" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-when").scrollIntoView(scrolling);
});

$( "#link-where" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-where").scrollIntoView(scrolling);
});

$( "#link-accommodations" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-hotel").scrollIntoView(scrolling);
});

$( "#link-faq" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-faq").scrollIntoView(scrolling);
});


// Form handling ------------------------------------------------------

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
    console.log("CLICK");
    if (input.attr("edited") == "false") {
        console.log("NANI");
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
    decision = select.next().filter( ".decision" );
    if (decision.length > 0) {
        choices = decision.children().filter( ".choice" );
        if (!choices.hasClass( "chosen" )) {
            choices.first().addClass( "chosen" );
        } else {
            choices.toggleClass( "chosen" );
        }
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

// Manually set height to 7*100vh
// (Chrome calculates height prior to translation of parallax elements, which shift down after transform)
//$( "#background" ).height("700vh");
