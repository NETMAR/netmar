<?xml version="1.0" encoding="UTF-8"?>
	<!-- License: GPL -->
	<!--
		XSLT tranform for service WSDL description into t2flow wrapperTypeXML
		description for DataInputs and ProcessOutputs services
	-->
	<!-- ${workspace_loc:/example.wsdl}  -->
	<!-- use example.wsdl -->
	<!-- NOTE: Assuming that a WSDL response will be identified with 'Response' is not accurate, the 
	correct approach should be to parse the WSDL I/O to determine the correct I/O names -->
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:s="http://org.embl.ebi.escience/xscufl/0.1alpha">
	<xsl:output method="xml" indent="yes" omit-xml-declaration="no" />
	<xsl:template match="/">

	<!-- Global variables -->
	<xsl:param name="uri" select="'http://org.embl.ebi.escience/xscufl/0.1alpha'"/>
	<!-- Loop to generate each dataInputs description -->
	
	<!-- DATAINPUTS -->
	<wrapperXML>
	<dataInputs>
	<xsl:for-each select="//*[local-name()='schema']/*[local-name()='element' and not(contains(@name,'Response'))]"> 
			<xsl:call-template name="dataIO">
			<xsl:with-param name="uri" select="$uri" />
			<xsl:with-param name="isInput" select="true()" />
			</xsl:call-template>
	</xsl:for-each>
	</dataInputs>
	<!-- PROCESSOUTPUTS -->
	<processOutput>
	<xsl:for-each select="//*[local-name()='schema']/*[local-name()='element' and contains(@name,'Response')]">
		<xsl:call-template name="dataIO">
			<xsl:with-param name="uri" select="$uri" />
			<xsl:with-param name="isInput" select="false()" />
			</xsl:call-template>
	</xsl:for-each>
	</processOutput>
	</wrapperXML>
	</xsl:template>
	
	<!-- DATAINPUTS/PROCESSOUTPUTS TEMPLATE -->
	<xsl:template name="dataIO">
		   <xsl:param name="uri" />
		   <xsl:param name="isInput" />
			<xsl:variable name='nameProcess' select='./@name'/>
			<xsl:element name="s:extensions" namespace="{$uri}">
				<xsl:element name="s:complextype"> <!-- complextype -->
				  <xsl:attribute name="optional"><xsl:value-of select="'false'"/></xsl:attribute>
				  <xsl:attribute name="unbounded"><xsl:value-of select="'false'"/></xsl:attribute>
				  <xsl:attribute name="typename"><xsl:value-of select="./@name" /></xsl:attribute>
				  <xsl:attribute name="name">
				  	<xsl:choose>
				  		<xsl:when test="$isInput"><xsl:value-of select="'DataInputs'"></xsl:value-of></xsl:when>
				  		<xsl:otherwise><xsl:value-of select="'ProcessOutputs'" /></xsl:otherwise>
				   </xsl:choose>
				  </xsl:attribute>
				  <xsl:attribute name="qname"><xsl:value-of select="concat('{',./../@targetNamespace,'}',./@name)" /></xsl:attribute>  
					<xsl:element name="s:elements"><!-- s:elements -->
						<xsl:for-each select=".//*[local-name()='element']"> <!-- loop thru  each input-->
							<xsl:element name="s:basetype"><!-- basetype -->
								<xsl:attribute name="optional">
									<xsl:choose>
										<xsl:when test="./@minOccurs=1">
											<xsl:value-of select="false()" />
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="true()"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								<xsl:attribute name="unbounded"><xsl:value-of select="false()"/></xsl:attribute>
								<xsl:attribute name="typename">
									<xsl:choose>
										<xsl:when test="not(./@type)">
											<xsl:value-of select="'anyType'"/>
										</xsl:when>
										<xsl:otherwise><!-- get type but remove xsd -->
											<xsl:value-of select="substring-after(./@type,'xsd:')" />
										</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								<xsl:attribute name="name"><xsl:value-of select="./@name"/></xsl:attribute>
								<xsl:attribute name="qname"><xsl:value-of select="concat('&gt;',$nameProcess,'&gt;',./@name)"/></xsl:attribute>
							</xsl:element><!-- end of basetype -->
						</xsl:for-each>
					</xsl:element><!-- end of s:elements -->
				
				</xsl:element><!-- end of complextype -->
			</xsl:element><!-- end of extensions -->
	</xsl:template>
	
	
</xsl:stylesheet>