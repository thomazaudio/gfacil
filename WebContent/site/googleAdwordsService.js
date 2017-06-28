angular.module('site')
    .factory('googleAdWordsService', function ($window) {
     
       // Basic settings for AdWords Conversion
        var googleTrackConversion = function (conversion_label) {
            $window.google_trackConversion({
            	google_conversion_id: 961892941,
            	google_conversion_language:  "en",
            	google_conversion_format:  "3",
            	google_conversion_color:  "ffffff",
            	google_conversion_label: "kv1ACJL6-nEQzaTVygM",
            	google_remarketing_only: false,
            });
        };
 return {
            registerLeadConversion: function () {
                // Trigger register-customer conversion 
                googleTrackConversion('register-lead');
            }
            
        };
    });