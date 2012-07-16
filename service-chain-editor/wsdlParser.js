/*!
 * wsdl functions
 * Includes  jkl-parserxml.js
 
 */
//generic functions
function isValidURL(textval) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(textval);
    }



function addContainer(labelText,inputs,outputs){
   //creates and adds container to arrContainer based on the last container position
   arrContainers.push({'label':labelText,containerInputs:inputs,containerOutputs:outputs})
} //end addContainer

function getMessage(data,name){
   return $data.find('message[name="' + name + '"]');
}

function getLocalName(elementName) {
   //from element name, remove name space if existing
   if (elementName.indexOf(":")<0){
      //no namespace
      return elementName;
   } else  {
      return elementName.split(":")[1];
   }
}

function URLExists(url)
{
    var http = new XMLHttpRequest();
    try {
      //console.log(url);
      http.open('HEAD', url, false);
      http.send();
    } catch (err)
    {	
      //the file may exist but there is a cross domain exception.
      //But the brower will first do the HEAD check and then raise the exception, 
      //unfortunally the HTTP code is not added to http.status
      alert("Cross Domain problem");
      return false;
    }
    return http.status!=404;
}//end of URLExists



function getElement(data, name) {
   return $(data).find('types schema element[name="' + name + '"]');
}

function getIOFromSchema(schemaEl, elCount, prog_callback, counter) {
   //get element content from schema, it can be I/O
   //returns an array with 0,1,n size according to the WSDL caracteristics
   //3 situations, no input, one input or multiple inputs
   var arr=new Array();
   //no input
   if(!schemaEl.attr('sequence')) {
      var elements = schemaEl.find('element');
      if(elements.length > 0) {
         elements.each(function(index, value) {
            arr.push($(value).attr('name'));
            if(elCount && prog_callback) {
              //prog_callback(arrContainers.length, elCount);
            }
         });
      } else {
         arr.push(schemaEl.attr('name'));
      }
   }
   currentProgressBar = (counter / elCount) * 100;
   //alert(currentProgressBar);
   //upb(prog_callback, counter, elCount);
   if(elCount && prog_callback) {
      //alert(arrContainers.length);
      //prog_callback(arrContainers.length, elCount);
   }
   
   return arr;

} //end function

function parseWSDL(wsdlURL, callback, prog_callback){
   if(domainProxy) {
      // proxy
      wsdlURL=domainProxy+"="+ wsdlURL;
   } else {
      //no proxy
      wsdlURL=wsdlURL;
   }

   //check if URL existis and is ok
   if(!(URLExists(wsdlURL))) {
      alert("NO WSDL IN URL") //need a proper pop up
      return null;
   }
   $.ajax({
      url: wsdlURL,
      success: function(data) {
         var resource_found = false;
         $.each(global_service_resources, function(index, value) {
            if(value == wsdlURL) {
               resource_found = true;
            }
         });
         $('#serviceListSearch_Value').html(serviceOption_items);
         if(!resource_found) {
            global_service_resources[global_service_resources.length] = wsdlURL;
         }
         var serviceOption_items = '';
         $.each(global_service_resources, function(index, value) {
            serviceOption_items += '<option value="' + value + '">' + value + '</option>';
         });
         //$('.serviceListSearchFilter').html((new Date().getTime()) + '<select name="serviceListSearch_Value">' + serviceOption_items + '</select>');
         $data = $(data);
         var $error = $data.find('parseerror');

         if($error.length > 0) {
            alert($error.text());
            return null;
         }
         var counter = 0;
         var elCount = $data.find('sequence element[name="input"]').length;
         currentProgressBar =0;
         var $operations = $data.find('portType operation');
         $operations.each(function(index, value) {
               ++counter;
               setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                  setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                     setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                        setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                           setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                              setTimeout(function(data, value, outName, callback, doCallback, prog_callback, arrLength, counter) {
                                 var outputArray = [];
                                 if(outName.length > 0) {
                                    outputArray = getIOFromSchema(outName, arrLength, prog_callback, counter);
                                    setTimeout(function(data, value, output, callback, doCallback, prog_callback, arrLength, counter) {
                                       setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                          setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                             setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                                setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                                   setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                                      setTimeout(function(data, value, inName, output, callback, doCallback, prog_callback, arrLength, counter) {
                                                         
                                                         var inputArray = [];


                                                         if(inName.length > 0) {
                                                            inputArray = getIOFromSchema(inName, arrLength, prog_callback, counter);
                                                         }
                                                            //alert(counter);
                                                         setTimeout(function(name, input, output, callback, doCallback, prog_callback, arrLength, counter) {
                                                            //alert(prog_callback);
                                                            addContainer(name, input, output);
                                                            if(callback && doCallback) {
                                                               if(prog_callback) {
                                                                  prog_callback(-1, 100);
                                                               }
                                                               callback(arrContainers);
                                                            }
                                                         }, counter*2, $(value).attr('name'), inputArray, output, callback, (index == (arrLength - 1)), prog_callback, arrLength, counter);
                                                         



                                                      }, counter, data, value, getElement(data, inName), output, callback, doCallback, prog_callback, arrLength, counter);
                                                   }, counter, data, value, getLocalName(inName), output, callback, doCallback, prog_callback, arrLength, counter);
                                                }, counter, data, value, inName.find('part').attr('element'), output, callback, doCallback, prog_callback, arrLength, counter);
                                             }, counter, data, value, getMessage(data, inName), output, callback, doCallback, prog_callback, arrLength, arrLength, counter);
                                          }, counter, data, value, getLocalName(inName), output, callback, doCallback, prog_callback, arrLength, counter);
                                       }, counter, data, value, $(value).find('input').attr('message'), output, callback, doCallback, prog_callback, arrLength, counter);
                                    }, counter, data, value, outputArray, callback, doCallback, prog_callback,arrLength, counter);
                                 }
                              }, counter, data, value, getElement(data, outName), callback, doCallback, prog_callback, arrLength, counter);
                           }, counter, data, value, getLocalName(outName), callback, doCallback, prog_callback, arrLength, counter);
                        }, counter, data, value, outName.find('part').attr('element'), callback, doCallback, prog_callback, arrLength, counter);
                     }, counter, data, value, getMessage(data, outName), callback, doCallback, prog_callback, arrLength, counter);
                  }, counter, data, value, getLocalName(outName), callback, doCallback, prog_callback, arrLength, counter);
               }, counter, $data, value, $(value).find('output').attr('message'), callback, (index == $operations.length - 1), prog_callback, $operations.length, counter);
         });
      }
   });
} //end of WSDL parser