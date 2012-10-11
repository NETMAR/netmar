/******************************************************************************
 *                                VARIABLES                                   *
 ******************************************************************************/

var mainCtn = $('#mainContainer');

// Options layout panel
var tabLayoutOptions = {
    name: 'tabPanelLayout', 
    resizeWithWindow: false, 
    west__onresize: resizeSidebarLayout, 
    west__size: "25%", 
    west__minSize: 350, 
    center__onresize: handle_resizeVolet, 
    spacing_open: 11, 
    spacing_closed: 11
};

// Options si sidebar contient un layout
var sidebarLayoutOptions = {
    name: 'sidebarPanelLayout', 
    resizeWithWindow: false, 
    center__paneSelector: ".inner-ui-layout-center", 
    north__paneSelector: ".inner-ui-layout-north", 
    south__paneSelector: ".inner-ui-layout-south", 
    east__paneSelector: ".inner-ui-layout-east", 
    west__paneSelector: ".inner-ui-layout-west", 
    north__size: "25%", 
    north__minSize: "30" /* la taille (en px) du header "Thèmes" + 5px*/,
    south__size: "25%", 
    closable: false, 
    spacing_open: 11, 
    spacing_closed: 11
};

// Options si panel "principal" (celui de droite) contient un layout
var centerLayoutOptions = {
    name: 'centerPanelLayout', 
    resizeWithWindow: false, 
    center__paneSelecto: ".inner-ui-layout-center", 
    north__paneSelector: ".inner-ui-layout-north", 
    south__paneSelector: ".inner-ui-layout-south", 
    east__paneSelector: ".inner-ui-layout-east", 
    west__paneSelector: ".inner-ui-layout-west", 
    spacing_open: 11, 
    spacing_closed: 11
};

// Symbolizer for geometries
var sketchSymbolizers = {
    "Point": {
        pointRadius: 4,
        graphicName: "square",
        fillColor: "white",
        fillOpacity: 1,
        strokeWidth: 1,
        strokeOpacity: 1,
        strokeColor: "#FFFF00"
    },
    "Line": {
        strokeWidth: 3,
        strokeOpacity: 1,
        strokeColor: "#FFFF00",
        strokeDashstyle: "dash"
    },
    "Polygon": {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "#FFFF00",
        fillColor: "#FFFF00",
        fillOpacity: 0.3
    }
};


/******************************************************************************
 *                                FUNCTIONS                                   *
 ******************************************************************************/

$(document).ready(loadLayout);

/**
 * Initialize all UI : events, layouts...
 */
function loadLayout() {

    // Display loading overlay
    displayLoadingImg();

    // Handle button events
    initBtnEvents($('div#mainContainer'));

    // Initialize dialog popup
    initDialogPopup();

    // Création du layout "interne" contenant les parties tabs (bouttons + panels)
    mainCtn.layout({
        name: 'tabsContainerLayout',
        center__paneSelector: "#viewerTab",
        resizable: false,
        slidable: false,
        closable: false,
        center__onresize: resizeTabPanelLayout // resize VISIBLE tabPanelLayouton
    });

    // Handle window resize event
    $(window).resize(
        function() {
            setDynamicHeightToPortletBody();
            resizeTabPanelLayout();
            resizeSidebarLayout();
            window.MapFaces.reloadAllMaps(true);
        }
    );

    $(window).trigger("resize");

    // ???
    // pour faire bouger les setter en même temps que le scroll...
    $('div#viewerTab > div.ui-layout-west > div.ui-layout-content > div.inner-ui-layout-center > div.ui-layout-content').scroll(
        function() {
            setCoucheSetterPosition();
            return false;
        }
    );

    // Center legends img on list_legend expand
    $("#list_legend").click(function() {
        resizeTabPanelLayout();
    });

    // Hide loading overlay
    hideLoadingImg();
}

/**
 * This function set a new height to the geoviewer portlet body. It 's called on each 
 * resize of the window  to simulate a heigth:100% on portlet-body div
 */
function setDynamicHeightToPortletBody() {   
    var geoviewerIpcStr = "geoviewer_ipc";
    // This boolean defines if the geoviewer_ipc portlet is in the same page of geoviewer portlet
    var hasGeoviewerIpc = false;
    var portletEltsArray = $('#column-1 .portlet-boundary');
    var mainCtn = $('#mainContainer');
    
    for (var i = 0; i <= 1; i++) {
        
        if (portletEltsArray[i] && portletEltsArray[i].id.indexOf(geoviewerIpcStr) != -1) {
            hasGeoviewerIpc = true;
            $(portletEltsArray[i]).css("margin",0);
            $(portletEltsArray[i]).css("padding",0);
        }
    }
    
    //Set a dynamic height only if the geowiewer is alone (or with the geoviewer_ipc portlet) on the page with a layout 1-column. 
    if ((portletEltsArray.length == 1 || (portletEltsArray.length == 2 && hasGeoviewerIpc))
        && mainCtn.length == 1) {      

        var portletHeaderHeight = (($('.portlet-topper').length == 0) ? 0 : $('.portlet-topper').outerHeight(true));
        var footerHeigth = (($('#footer').length == 0) ? 0 : $('#footer').outerHeight(true));    
        var newHeight = $(window).height() - mainCtn.offset().top - portletHeaderHeight - footerHeigth - 20;

        if (newHeight < 150) newHeight = 150;

        mainCtn.css("height", parseFloat(newHeight));       
    }
}

/**
 * Events handling for button.
 */
function initBtnEvents(obj) {
    $(".button:not(.ui-state-disabled)", obj).hover(
        function(){
            $(this).addClass("ui-state-hover");
        },
        function(){
            $(this).removeClass("ui-state-hover");
        }
    ).mousedown(
        function(){
            $(this)
            .parents('.buttonSet-single:first')
            .find(".button.ui-state-active")
            .removeClass("ui-state-active");

            if( $(this).is('.ui-state-active.button-toggleable, .buttonSet-multi .ui-state-active') ) {
                $(this).removeClass("ui-state-active");
            }
            else {
                $(this).addClass("ui-state-active");
            }
        }
    ).mouseup(
        function(){
            if(! $(this).is('.button-toggleable, .buttonSet-single .button, .buttonSet-multi .button') ) {
                $(this).removeClass("ui-state-active");
            }
        }
    ).click(
        function() {
            return false;
        }
    );
}

/**
 * Log function
 */
function debug(){
    if(isDEV) {
        console.log.apply(this,arguments);
    }
}

///**
// * @deprecated
// */
//function clearForm(oForm) {
//    $('div.field :input, div.field :selected, div.field :checked', oForm)
//    .not(':button, :submit, :reset, :hidden')
//    .val('')
//    .removeAttr('checked')
//    .removeAttr('selected')
//    ;
//
//    $('div.checkboxTree').filter('.jstree').jstree('uncheck_all');
//};

/**
 * Function used to open/close the panels (Layers/Legends/Localisation).
 */
function resizeTabPanelLayout() {
    var oTabPanel = $('#viewerTab').show(); // make sure is 'visible'
    var oTabLayout;

    // IF tabLayout exists - get Instance and call resizeAll
    if( oTabPanel.data("layoutContainer") ) {
        // resize the layout-panes - if required
        oTabLayout = oTabPanel.layout();
        oTabLayout.resizeAll();
    }
    
    // else if tabLayout does not exist yet, create it now and create collapsibles, tree, etc
    else {
        oTabLayout = oTabPanel.layout( tabLayoutOptions );

        // also create other layout
        if(oTabLayout.panes.center.find(".inner-ui-layout-center").length) {
            oTabLayout.panes.center.find(".ui-layout-content").layout( centerLayoutOptions );
        }

        if(oTabLayout.panes.west.find(".inner-ui-layout-center").length) {
            oTabLayout.panes.west.find(".ui-layout-content").layout( sidebarLayoutOptions );
        }
        
        create_collapsible(oTabLayout, "west");
        create_volet(oTabLayout, "center");
    }

    handle_resizeVolet();

    return;
}

/**
 * Initialize collapsible elements.
 */
function create_collapsible(tabLayout, where) {
    var oCollapsibles = tabLayout.panes[where].find('div.collapsible');

    if(oCollapsibles.length) {
        oCollapsibles.each(
            function() {
                var $this = $(this);
                if(!$this.hasClass("ui-collapsible")) $this.collapsible();
            }
        );
    }
}

/**
 * Initialize volet elements.
 */
function create_volet(tabLayout, where) {
    var oVolet = tabLayout.panes[where].find('div.volet');

    if(oVolet.length) {
        oVolet.each(
            function() {
                var $this = $(this);
                if(!$this.parent().hasClass("ui-volet")) {
                    $this.volet();
                }
            }
        );
    }
}

/**
 * Resize volet elements.
 */
function handle_resizeVolet(){
    var oVoletBlockContainers = $('div.ui-volet-blockContainer');

    if(oVoletBlockContainers.length) {
        oVoletBlockContainers.each(
            function() {
                var $this = $(this);
                var oParent = $this.parent();
                var oVolet = $this.find('.ui-widget-content');
         
                $this.height((oParent.height() - 20) + 'px');
                oVolet.volet('setVoletSize');
            }
        );
    }
}

/**
 * Function used to resize the sidebare layout (left/right).
 */
function resizeSidebarLayout () {
    var oTabPanel = $('#viewerTab').show(); // make sure is 'visible'
    var oSidebarPanel = $('.ui-layout-west > .ui-layout-content',oTabPanel);
    var oSidebarLayout;

    // IF idebarLayout exists - get Instance and call resizeAll
    if( oSidebarPanel.data("layoutContainer") ) {
        // resize the layout-panes - if required
        oSidebarLayout = oSidebarPanel.layout();
        oSidebarLayout.resizeAll();
    }
    
    var legends = jQuery(".layer", jQuery("table[id$='legends_LayerControl']"));
    if(legends.length) {
        legends.each(
            function() {
                var elem = $(this);
                var width = jQuery("#list_legend").width();
                elem.css("width", width - 22);
                elem.css("overflow", "auto");
            }
        );
    }
    
    return;
}

/**
 * ???
 */
function setCoucheSetterPosition() {
    var oSetterContainer = $('#couche-setter');
    var oActiveButtonContainer = $('.couches li.parameter.ui-state-active');

    if(oActiveButtonContainer.length) {
        var pos = oActiveButtonContainer.offset();
        var ySetter = parseInt(pos.top, 10);
        var xSetter = parseInt(pos.left + oActiveButtonContainer.outerWidth(), 10);

        var oLayoutContent = oActiveButtonContainer.parents('.ui-layout-content');
        var yTopLimit = parseInt(oLayoutContent.offset().top, 10);
        var yBottomLimit = parseInt(yTopLimit + oLayoutContent.outerHeight(), 10);

        if(ySetter < yTopLimit || ySetter > yBottomLimit) {
            oSetterContainer.css('opacity', 0.2);
        }
        else {
            oSetterContainer.css('opacity', 1);
        }

        oSetterContainer.css({
            'top' : ySetter + 'px',
            'left' : xSetter + 'px'
        });
    }

    return false;
}

/**
 * This function display a popup when a html component has is name attribute sets 
 * to 'modal' and a href attribute sets to a metaDataUrl
 */
function initDialogPopup() {
    //select all the 'a' tags with name equal to modal
    var aElems = $('a[name=modal]');
    
    aElems.live('click', function(e) {
        var aElem = $(this);
        
        // cancel the link behavior
        e.preventDefault();
        
        // load popup CSS
        var cssNode = document.createElement('link');
        cssNode.setAttribute('rel', 'stylesheet');
        cssNode.setAttribute('type', 'text/css');
        cssNode.setAttribute('href', 'https://www.ifremer.fr/sextant_doc/popup/css/popup.debug.css');
        document.getElementsByTagName('head')[0].appendChild(cssNode);
        
        // create the popup div if required
        if (!$('#popup-dialog-div').length) {
            $('body').append($('<div style="display:none;overflow:hidden;" id="popup-dialog-div" />'));
        }
        
        // open popup
        var layerName = aElem.text();
        $('#popup-dialog-div').dialog({
            autoOpen: true,
            modal: true,
            resizable: false,
            height: Math.floor(parseInt($(window).height(),10) * 0.75),
            width: Math.floor(parseInt($(window).width(),10) * 0.75),
            draggable: false,
            closeText: 'Fermer',
            title: aElem.attr('value') || layerName,
            open: function() {
                $(this).html('<iframe frameborder="0" width="100%" height="100%" src="' + aElem.attr("href") + '"></iframe>');
            }
        });
    });
}

/**
 * Function used to display featureInfo request result (onComplete event).
 */
function afterGetFeatureInfo (request, event, data) {
    var volet = $('.ui-volet');
    
    if (volet.length > 0) {
        var height = volet.height();
        var len = $('.ui-volet table').length;

        if (len > 0 && height < 25) {
            $('.ui-volet-toggleHandle').click();

        } else if (len == 0 && height > 25) {
            $('.ui-volet-toggleHandle').click();
        }
    }
}  

/**
 * Display the WMSAddingTool popup.
 */
function closeWmsPopup() {
    $("div[id*='wmsPopup'] .changeActionBar").click();
}

/**
 * Hide the WMSAddingTool popup.
 */
function hideWmsPopup() {
    $("div[id*='wmsPopup']").css("display", "none");
}

/**
 * Display the loading image.
 */
function displayLoadingImg() {
    document.getElementById("loadbg").style.display = "block";
}

/**
 * Hide the loading image.
 */
function hideLoadingImg() {
    document.getElementById("loadbg").style.display = "none";
}

/**
 * This function display the loader correctly when you try to load a GetCapabilities.
 */
function adjustWmsAddLoader() {
    var loaderContainer = $(".wmsadd-loader");
    
    if (loaderContainer) {
        
        if (loaderContainer.css("display") == "none") {
            loaderContainer.css("display", "block");
            
        } else {
            loaderContainer.css("display", "none");
        }
        
        if (loaderContainer.css("top") == "0px") {
            var top = 52;
            if ($(".wmslist").length == 1)
                top = 88;

            loaderContainer.css("top", top + "px");
        }
    }    
}

/**
 * This function is used to open the CodeEditor volet (when receive wps execute 
 * response or when user clicks on the button to open it).
 */
function resizeXmlContainer(boutton, containerId, popupContainer) {
    var container = $("#" + containerId);
    var popup = popupContainer.childNodes[1];
    
    if(container.is(":hidden")) {
        $(boutton).removeClass('disabled');
        $(boutton).addClass('enabled');
        container.show();  
        $(popup).animate({
            width:"1200px",
            marginLeft:"-600px"
        }, 800);
            
    } else {
        $(boutton).removeClass('enabled');
        $(boutton).addClass('disabled');
        container.hide();  
        $(popup).animate({
            width:"424px",
            marginLeft:"-212px"
        }, 800);
    }
}