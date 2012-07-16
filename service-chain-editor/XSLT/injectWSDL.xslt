<?xml version="1.0" encoding="UTF-8"?>
<!-- After running wrapperTypeXML.xslt we have an XML document with WSDL sections  (parsedWSDL.xml)-->
<!-- This XSLt will run on eumis2.xml  amnd for each position wht container <label>ExecuteProcess_v.voronoi</label> <xtype>WireIt.TavernaContainer</xtype> inject wrapper-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml" indent="yes" omit-xml-declaration="yes" />
	<!-- URL WSDL is passed in the  $proc = new XSLTProcessor;$proc->setParameter('', 'owner', $name);-->
	  <xsl:param name="wrapperURL" />
	  
	  <xsl:variable name="wrapperDoc" select="document($wrapperURL)/wrapperXML"/>
	<!--   <xsl:variable name="wrapperDoc" select="document('http://localhost/v1/XSLT/wrapperDoc.xml')/wrapperXML"/>  -->
	 	
	 <xsl:template match="*|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

	<xsl:template match="positions">
		<xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
     <!--        wrapperXML/dataInputs/*[local-name()='extensions']/*[local-name()='complextype' and @typename='ExecuteProcess_gml2svg']/..  -->
           <!--  <xsl:copy-of select="$wrapperDoc//dataInputs/*"/> -->
            <xsl:if test="./xtype/text()='WireIt.TavernaContainer'">
            	
            	<xsl:element name="wrapperXML">
            <!-- 		<xsl:value-of select="./label/text()"/>  -->
            	<xsl:variable name="labelTextIn" select="./label/text()"/>
            	<DataInputs>
            	<xsl:copy-of select="$wrapperDoc/dataInputs/*[local-name()='extensions']/*[local-name()='complextype' and @typename=$labelTextIn]/.." />
				
            	
			<!-- 	<xsl:copy-of select="$wrapperDoc/dataInputs/*[local-name()='extensions']/*[local-name()='complextype' and @typename=$labelTextIn]/.."/>  -->
				</DataInputs>
				<ProcessOutputs>
				<xsl:variable name="labelTextOut" select="concat(./label/text(),'Response')"/>
				<xsl:copy-of select="$wrapperDoc/processOutput/*[local-name()='extensions']/*[local-name()='complextype' and @typename=$labelTextOut]/.."/>
				</ProcessOutputs>	
            	</xsl:element>
            </xsl:if>
            
        </xsl:copy>
		
    </xsl:template>
   


</xsl:stylesheet>