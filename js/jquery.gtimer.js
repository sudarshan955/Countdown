// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


;(function($) {
    jQuery.gCountDown = function(element, options) {
        this.$element = $( element ),
        this.until = this.since = this.yr = this.mo = this.day = this.hr = this.min = this.sec = null;

        var now = new Date();
        var defaults = {
            format: 'yy:mm:dd', // If [since] or [until] date provide as string then which format will use describe with colon(:) separator.
            since: Date.now(), // From this date countdown will be started. 
            // Format: new Date(years, months, days, hours, minutes, seconds) a Date object or numeric or string of milliseconds.
            until: null, // The until date to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds) a Date object or date string(acording to format) with or without 
            // hours minutes seconds. The time format must be as H:M:S where H = hours, M = minutes, S = seconds. Also
            // can use numeric or string of milliseconds. If until value is provided other parameter will be omited except since value
            years: new Date( now.getFullYear() + 1, now.getMonth(), now.getDay() ).getFullYear(), // The target years up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or four digit number
            // default: Always set to new year
            months: 1, // The target monhth(s) up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or month(s) number
            // according to 1-12.
            // default: Always set to January
            days: 1, // The target day(s) up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or day(s) number
            // according to month.
            // default: Always set to 1st day
            hours: 0, // The target hour(s) up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or day(s) number
            // according to 0-23.
            // default: 0
            minutes: 0, // The target minute(s) up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or day(s) number
            // according to 0-59.
            // default: 0
            seconds: 0, // The target second(s) up to countdown
            // Format: new Date(years, months, days, hours, minutes, seconds)  or numeric or string of milliseconds or day(s) number
            // according to 0-59.
            //default : 0
            interval: 1000, //milliseconds
            onUpdate: null,
            onComplete: null,

            /*dateOffset: {                
                years: 1,
                months: 1,
                days: new Date(),
                hours: new Date(),
                minutes: new Date(),
                seconds: new Date(),
            }*/
            omitYear: false,
            omitMonths: false,
            omitWeeks: false,
            omitDays: false,            
            omitHours: false,
        };
        
        this.defaultOptions = jQuery.extend( {}, defaults, options );
        /*if ( typeof this.defaultOptions.since == 'object' ) {
            //defaultOptions.since = defaultOptions.since;
        }*/
        this.__start();
        
    };

    jQuery.extend( jQuery.gCountDown.prototype, {
        __start: function() {
            var self = this;
            if ( this.__interval !== null ) {
                clearInterval( this.__interval );
            }

            this.__setDate( new Date() );
            this.__interval = setInterval(function() {
                self.__now = new Date();
                self.__update.call( self );
            }, this.defaultOptions.interval);
        },

        __stop: function() {
            clearInterval( this.__interval );
            if ( typeof this.defaultOptions.onComplete == 'function' ) {
                this.defaultOptions.onComplete(this.$element);
            }
            return;
        },

        __pause: function() {
            return this.__stop();
        },

        __resume: function() {
            this.__start();
        },

        __update: function() {

            var offset = 1; // sameDay
            if ( !this.__sameDay( this.__now ) ) {
                offset = 0; // is not sameDay
                this.__setCurrentDate( this.__now );
            }
            var now = this.__now;
            if ( this.__until.getTime() <= this.__now.getTime() ) {
                return this.__stop();
            }

            // Calculate how much days left
            if ( this.__until.getDate() < this.__now.getDate() ) {
                // Formula: ( ( untilDate + untilPreviousMonthDate ) - sinceDate )
                ( ( this.__until.getDate() + new Date( this.__until.getFullYear(), this.__until.getMonth(), 0 ).getDate() ) - this.__now.getDate() );
                this.__resetSinceDate(this.__now, 'm');
            } else {
                day = ( this.__until.getDate() - ( this.__now.getDate() + offset ) );
            }

            if ( this.__until.getMonth() < this.__now.getMonth() ) {
                mo = ( ( this.__until.getMonth() + 12 ) - this.__now.getMonth() );
                this.__resetSinceDate(this.__now, 'y');
            } else {
                // : ( ( this.__until.getMonth() - this.__now.getMonth() ) + ( this.__getYear() * 12 ) )
                mo = ( this.__until.getMonth() - this.__now.getMonth() );
            }

            yr = this.__getYear();

            if ( this.defaultOptions.omitYears ) {
                mo = ( mo + ( yr * 12 ) );
                yr = null
            }

            if ( this.defaultOptions.omitMonths ) {
                mo = null;
            }

            this.__now = new Date( now.getFullYear() + yr, now.getMonth() + mo, ( now.getDate() - 1 ), now.getHours(), now.getMinutes(), now.getSeconds() );

            var diff =  this.__getDiff();

            sec = ( diff % 60 ), // Get Seconds
            min = ( Math.floor( diff / 60 ) % 60 ), // Get Minutes
            hr  = ( Math.floor( Math.floor( diff / 60 ) / 60 ) % 24 ); // Get Hours
            day = ( !offset ) ? ( Math.floor( Math.floor( Math.floor( diff / 60 ) / 60 ) /  24 ) ) : day; // Get Days

            if ( !this.defaultOptions.omitWeeks ) {
                wk  = ( Math.floor( day / 7 ) ); //Get Weeks
                day = ( Math.floor( day % 7 ) ); // Reset Days
            } else {
                wk = null;
            }

            if ( this.defaultOptions.omitDays ) {
                hr  += ( day * 24 ); // Reset Hours
                day = null;
            }

            if ( this.defaultOptions.omitHours ) {
                min += ( hr * 60 ); // Reset Minutes
                hr  = null;
            }

            var gDate = {};
            if ( yr != null ) {
                gDate.years = yr;
            }
            if ( mo != null ) {
                gDate.months = mo;
            }
            if ( wk != null ) {
                gDate.weeks = wk;
            }
            if ( day != null ) {
                gDate.days = day;
            }
            if ( hr != null ) {
                gDate.hours = hr;
            }

            gDate.minutes = min;
            gDate.seconds = sec;
            gDate.since = this.__since;
            gDate.until = this.__until;

            //console.log(sbDate);
            if ( typeof this.defaultOptions.onUpdate == 'function' ) {
                //console.log(gDate);
                this.defaultOptions.onUpdate( gDate, this.$element );
            }

                    //this.defaultOptions.onUpdate.call(this, sbDate);
        },

        __getDiff: function() {
            return ( ( this.__until.getTime() - this.__now.getTime() ) / 1000 );
        },

        __getYear: function() {
            return ( this.__until.getFullYear() - this.__now.getFullYear() );
        },

        __setDate: function(now) {
            // Redefine Until And Since Date
            var Ryr  = this.__resetDefaults( this.defaultOptions.years, 'y' ),
                Rmo  = this.__resetDefaults( this.defaultOptions.months, 'o' ),
                Rday = this.__resetDefaults( this.defaultOptions.days, 'd' ),
                Rhr  = this.__resetDefaults( this.defaultOptions.hours, 'h' ),
                Rmin = this.__resetDefaults( this.defaultOptions.minutes, 'm' ),
                Rsec = this.__resetDefaults( this.defaultOptions.seconds, 's' );
                this.__until = this.defaultOptions.until = new Date( Ryr, Rmo, Rday, Rhr, Rmin, Rsec );
                //console.log(this.__until);
                this.__since = this.defaultOptions.since = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() );
                //console.log(this.__since);
        },

        __sameDay: function(now) {
            //console.log(( this.__until.getDate() == now.getDate() + 1 ));
            return ( this.__until.getDate() == now.getDate() + 1 ) ? true : false;
        },

        __setCurrentDate: function(now) {
            //console.log(now.getDate());
            //console.log(this.__sameDay( now ) ? 0 : 1 )
            //console.log(now.getDate() + Math.abs( this.__sameDay( now ) ? 0 : 1 ));
            //console.log(now);
            //console.log(this.__until.getTime());
            this.__now = new Date( now.getFullYear(), now.getMonth(), now.getDate() + 1, now.getHours(), now.getMinutes(), now.getSeconds() );
            //this.__now = new Date( now.getFullYear(), now.getMonth(), now.getDate() + Math.abs( this.__sameDay( now ) ? 0 : 1 ), now.getHours(), now.getMinutes(), now.getSeconds() );
            //console.log(this.__now.getTime());
            //console.log(this.__until);
            //console.log(this.__now);
        },

        __resetSinceDate: function(date, dateType) {
            if ( dateType == 'm' ) {
                this.__now = new Date( date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
            } else if( dateType == 'y' ) {
                this.__now = new Date( date.getFullYear() + 1, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
            }
        },

        __resetDefaults: function(value, dataType) {
            //console.log(value.toString().length);
            // Define yr value based on input
            if ( typeof value == 'object' ) { // If value is defined as object
                if ( dataType == 'y' ) {
                    return value.getFullYear();
                } else if ( dataType == 'o' ) {
                    return value.getMonth();
                } else if ( dataType == 'd' ) {
                    return value.getDate();
                } else if ( dataType == 'h' ) {
                    return value.getHours();
                } else if ( dataType == 'm' ) {
                    return value.getMinutes();
                } else {
                    return value.getSeconds();
                }
            } else if ( value.toString().length == 4 ) { // If value is defined as year
                return value;
            } else { // The value is a millisecond string(number) or number or months, days, hours, minutes, seconds
                var gDate = new Date();
                    gDate.setTime( value );

                if ( dataType == 'y' ) {
                    return gDate.getFullYear();
                } else if ( dataType == 'o' ) {
                    return ( value >= 1 || value <= 12 ) ? (value-1) : gDate.getMonth();
                } else if ( dataType == 'd' ) {
                    return ( value >= 1 || value <= 31 ) ? value : gDate.getDate();
                } else if ( dataType == 'h' ) {
                    return ( value >= 0 || value <= 23 ) ? value : gDate.getHours();
                } else if ( dataType == 'm' ) {
                    return ( value >= 0 || value <= 59 ) ? value : gDate.getMinutes();
                } else {
                    return ( value >= 0 || value <= 59 ) ? value : gDate.getSeconds();
                }
            }
        }
    } );


    jQuery.fn.gCountDown = function(options) {
        var elem = this;
        var gCountDownDefaults = jQuery.extend( true, {}, gTimerDefaults, options );
        //console.log(gCountDownDefaults);
        return elem.each( function(index) {
            //console.log(elem);
            if ( 'undefined' == typeof $( elem ).eq(index).data( 'gCountDown' ) ) {
                var gCountDown = new jQuery.gCountDown( elem, gCountDownDefaults );
                $( elem ).eq(index).data( 'gCountDown', gCountDown );
            }
        } );
    };


    jQuery.fn.gTimer = function(options) {
        var elem = this, //dom object element
            $elem = $( this ); //jQuery dom object element

            gTimerDefaults = {
                action: false
            };

            gTimerDefaults = jQuery.extend( true, {}, gTimerDefaults, options );
            //console.log(gTimerDefaults);
        return elem.each( function(index) {
            //console.log('calling...')
            $( this).text( index+1 );
            //console.log($(this));
            switch (gTimerDefaults.action) {
                case 'clock':
                    break;
                case 'countdown':
                    console.log(index);
                    $elem.eq( index ).gCountDown( gTimerDefaults );
                    break;
                default :
                    break;
            }
        } );
    };

})(jQuery);