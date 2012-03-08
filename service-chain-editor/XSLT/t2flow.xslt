<?xml version="1.0" encoding="UTF-8"?>
	<!-- License: GPL -->
	<!-- XSLT tranform between XML generate in EUMIS and t2flow -->
	<!-- To run outside web service, use file below, and use test variables debug -->
	<!-- ${workspace_loc:/XSLT/eumisB4t2flow.xml}  -->
	<!-- new eumisWSDL.xml with WSDL content  ${workspace_loc:/eumisWSDL.xml} -->
	<!-- use eumis.xml -->
<xsl:stylesheet version="1.1"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://taverna.sf.net/2008/xml/t2flow">
	<xsl:output method="xml" indent="yes" omit-xml-declaration="no" />
    <!-- EXTERNAL VARIABLES -->
    <!-- $t2flowArr=array('dateEumis' => $dateEumis, 'uuidEumis'=> $uuidEumis); -->
    
    <!-- TEST VARIABLES DEBUG-->
    <!-- 
    <xsl:variable name="uuid"><xsl:value-of select="'16ccb095-cbc3-4eb9-a878-ac7c080eb884'" /></xsl:variable>
    <xsl:variable name="date"><xsl:value-of select="'2012-01-05 14:25:21 BST'" /></xsl:variable>
     -->
    <!-- REMOVE TO DEBUG -->
    
    <xsl:param name="dateEumis" />
    <xsl:param name="uuidEumis" />
	<xsl:variable name="uuid">
			<xsl:value-of select="$uuidEumis"></xsl:value-of>
	</xsl:variable>
	<xsl:variable name="date">
			<xsl:value-of select="$dateEumis"></xsl:value-of>
	</xsl:variable>
	 
	<!-- END OF REMOVE TO DEBUG -->
	
	<xsl:variable name="wsdlURL">
		<!--
			in case the wsdlURL has http:// then pass without changes otherwise
			add http://
		-->
		<xsl:choose>
			<xsl:when test="contains(//wsdlURL/text(),'http://')">
				<xsl:value-of select="//wsdlURL/text()" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="concat('http://',//wsdlURL/text())" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="name">
		<xsl:value-of select="'Workflow1'" />
	</xsl:variable>

	<!--END OF VARIABLES -->

	<xsl:template match="/">
		<!-- Root element -->
		<xsl:element name="workflow">
			<xsl:attribute name="version"><xsl:value-of select="'1'" /></xsl:attribute>
			<xsl:attribute name="producedBy"><xsl:value-of select="'taverna-2.3.0'" /></xsl:attribute>
		<!-- 	<xsl:attribute name="author"><xsl:value-of select="'eumis-webgui'" /></xsl:attribute>  -->
			<xsl:element name="dataflow">
				<xsl:attribute name="id"><xsl:value-of select="$uuid" /></xsl:attribute>
				<xsl:attribute name="role"><xsl:value-of select="'top'" /></xsl:attribute>
			
			<xsl:element name="name">
				<xsl:value-of select="$name" />
			</xsl:element>
			<!-- no input ports, inputs are actual processes with standard value -->
			<xsl:element name="inputPorts" />
			<xsl:for-each select="//positions/containerType[text()='output']/..">
				<xsl:call-template name="outputPort">
				</xsl:call-template>
				</xsl:for-each>
				<!-- PROCESSORS SECTION -->
				<xsl:element name="processors">
					<!--  input port that is actual a processor with constant value -->
					<xsl:for-each select="//positions/containerType[text()='input']/..">
						<xsl:call-template name="inputPort"></xsl:call-template>
					</xsl:for-each>
				
					<!--
						starting with processors that aren't outputs (already done above)
					-->
					<xsl:for-each
						select="//positions/xtype[text()='WireIt.TavernaContainer']/..">
						<xsl:call-template name="genericProcessor">
							<xsl:with-param name="processorName" select="./label/text()" />
							<xsl:with-param name="wsdlURL" select="$wsdlURL" />
						</xsl:call-template>
						<xsl:call-template name="processorDataInputs">
							<xsl:with-param name="processorName" select="./label/text()" />
						</xsl:call-template>
						<xsl:call-template name="processorProcessOutputs">
							<xsl:with-param name="processorName" select="./label/text()" />
						</xsl:call-template>
					</xsl:for-each>
				</xsl:element> <!-- end or Processors section/content -->
		
			<!-- CONDITIONS -->
			<!--  No need to implement -->
				<conditions />
				
			<!--  DATA LINKS -->
			<datalinks>
				<!-- datalinks define two situations: DataInputs/ProcessOutptus per process, 
				links between the datainputs and processOutputs -->
				<xsl:for-each select="/root/positions/xtype[text()='WireIt.TavernaContainer']/.."><xsl:call-template name="dataLinksProcess"></xsl:call-template></xsl:for-each>
			 	<!-- This need to change from wires to wires/wire -->
				<!-- 
				<xsl:for-each select="//root/wires">
					<xsl:call-template name="dataLinks" />
				</xsl:for-each>
			 -->
			   <!-- Links between processes and I/O dataflow -->
			   <xsl:for-each select="//root/wires"><xsl:call-template name="dataLinksActual"></xsl:call-template></xsl:for-each>
			</datalinks>
			
			<!-- ANNOTATIONS -->
			<xsl:call-template name="annotations"/>
			
			</xsl:element> <!-- end of dataflow element -->
		</xsl:element><!-- end of workflow (root) element -->
	</xsl:template>
	<xsl:template name="outputPort">

		<outputPorts>
			<port>
				<name>

					<xsl:value-of select="./label/text()" />
				</name>
				<annotations />
			</port>
		</outputPorts>

	</xsl:template> <!-- end of name='ouput' -->
	
	<xsl:template name="inputPort"><!-- input processor it is equal to the genericProcessor -->
			<processor>
				<name><xsl:value-of select="./label/text()"></xsl:value-of></name>
				<inputPorts />
				<outputPorts>
					<port>
						<!--  no need to change ? -->
						<name>value</name>
						<depth>0</depth>
						<granularDepth>0</granularDepth>
					</port>
				</outputPorts>
				<annotations />
				<activities>
					<activity>
						<raven>
							<group>net.sf.taverna.t2.activities</group>
							<artifact>stringconstant-activity</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.activities.stringconstant.StringConstantActivity</class>
						<inputMap />
						<outputMap>
							<map from="value" to="value" />
						</outputMap>
						<configBean encoding="xstream">
							<net.sf.taverna.t2.activities.stringconstant.StringConstantConfigurationBean
								xmlns="">
								<!-- literalData or inputURL goes into <value /> -->
								<value>
									<xsl:choose>
										<xsl:when test="./literalData !=''"><xsl:value-of select="./literalData/text()"></xsl:value-of></xsl:when>
										<xsl:otherwise><!-- assuming URL --><xsl:value-of select="concat('http://',./inputURL/text())" /></xsl:otherwise>	
									</xsl:choose>
								</value>
							</net.sf.taverna.t2.activities.stringconstant.StringConstantConfigurationBean>
						</configBean>
						<annotations />
					</activity>
				</activities>
				<dispatchStack>
					<dispatchLayer>
						<raven>
							<group>net.sf.taverna.t2.core</group>
							<artifact>workflowmodel-impl</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Parallelize</class>
						<configBean encoding="xstream">
							<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig
								xmlns="">
								<maxJobs>1</maxJobs>
							</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig>
						</configBean>
					</dispatchLayer>
					<dispatchLayer>
						<raven>
							<group>net.sf.taverna.t2.core</group>
							<artifact>workflowmodel-impl</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ErrorBounce</class>
						<configBean encoding="xstream">
							<null xmlns="" />
						</configBean>
					</dispatchLayer>
					<dispatchLayer>
						<raven>
							<group>net.sf.taverna.t2.core</group>
							<artifact>workflowmodel-impl</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Failover</class>
						<configBean encoding="xstream">
							<null xmlns="" />
						</configBean>
					</dispatchLayer>
					<dispatchLayer>
						<raven>
							<group>net.sf.taverna.t2.core</group>
							<artifact>workflowmodel-impl</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Retry</class>
						<configBean encoding="xstream">
							<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig
								xmlns="">
								<backoffFactor>1.0</backoffFactor>
								<initialDelay>1000</initialDelay>
								<maxDelay>5000</maxDelay>
								<maxRetries>0</maxRetries>
							</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig>
						</configBean>
					</dispatchLayer>
					<dispatchLayer>
						<raven>
							<group>net.sf.taverna.t2.core</group>
							<artifact>workflowmodel-impl</artifact>
							<version>1.3</version>
						</raven>
						<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Invoke</class>
						<configBean encoding="xstream">
							<null xmlns="" />
						</configBean>
					</dispatchLayer>
				</dispatchStack>
				<iterationStrategyStack>
					<iteration>
						<strategy />
					</iteration>
				</iterationStrategyStack>
			</processor>
	
	
	
	</xsl:template>
	
	
	<xsl:template name="genericProcessor">
		<xsl:param name="processorName" />
		<xsl:param name="wsdlURL" />
		<processor>
			<name>
				<xsl:value-of select="$processorName" />
			</name>
			<inputPorts>
				<port>
					<name>DataInputs</name>
					<depth>0</depth>
				</port>
			</inputPorts>
			<outputPorts>
				<port>
					<name>ProcessOutputs</name>
					<depth>0</depth>
					<granularDepth>0</granularDepth>
				</port>
			</outputPorts>
			<annotations />
			<activities>
				<activity>
					<raven>
						<group>net.sf.taverna.t2.activities</group>
						<artifact>wsdl-activity</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.activities.wsdl.WSDLActivity</class>
					<inputMap>
						<map from="DataInputs" to="DataInputs" />
					</inputMap>
					<outputMap>
						<map from="ProcessOutputs" to="ProcessOutputs" />
					</outputMap>
					<configBean encoding="xstream">
						<net.sf.taverna.t2.activities.wsdl.WSDLActivityConfigurationBean
							xmlns="">
							<wsdl>
								<xsl:value-of select="$wsdlURL" />
							</wsdl>
							<operation>
								<xsl:value-of select="$processorName" />
							</operation>
						</net.sf.taverna.t2.activities.wsdl.WSDLActivityConfigurationBean>
					</configBean>
					<annotations />
				</activity>
			</activities>
			<dispatchStack>
				<dispatchLayer>
					<raven>
						<group>net.sf.taverna.t2.core</group>
						<artifact>workflowmodel-impl</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Parallelize</class>
					<configBean encoding="xstream">
						<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig
							xmlns="">
							<maxJobs>1</maxJobs>
						</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig>
					</configBean>
				</dispatchLayer>
				<dispatchLayer>
					<raven>
						<group>net.sf.taverna.t2.core</group>
						<artifact>workflowmodel-impl</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ErrorBounce</class>
					<configBean encoding="xstream">
						<null xmlns="" />
					</configBean>
				</dispatchLayer>
				<dispatchLayer>
					<raven>
						<group>net.sf.taverna.t2.core</group>
						<artifact>workflowmodel-impl</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Failover</class>
					<configBean encoding="xstream">
						<null xmlns="" />
					</configBean>
				</dispatchLayer>
				<dispatchLayer>
					<raven>
						<group>net.sf.taverna.t2.core</group>
						<artifact>workflowmodel-impl</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Retry</class>
					<configBean encoding="xstream">
						<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig
							xmlns="">
							<backoffFactor>1.0</backoffFactor>
							<initialDelay>1000</initialDelay>
							<maxDelay>5000</maxDelay>
							<maxRetries>0</maxRetries>
						</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig>
					</configBean>
				</dispatchLayer>
				<dispatchLayer>
					<raven>
						<group>net.sf.taverna.t2.core</group>
						<artifact>workflowmodel-impl</artifact>
						<version>1.3</version>
					</raven>
					<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Invoke</class>
					<configBean encoding="xstream">
						<null xmlns="" />
					</configBean>
				</dispatchLayer>
			</dispatchStack>
			<iterationStrategyStack>
				<iteration>
					<strategy>
						<cross>
							<port name="DataInputs" depth="0" />
						</cross>
					</strategy>
				</iteration>
			</iterationStrategyStack>
		</processor>
	</xsl:template>
	<xsl:template name="processorDataInputs">
		<xsl:param name="processorName" />

		<!--
			this template
			calls:<activitiesIn>,<dispatchStackIn>,<iterationStrategyStackIn>
		-->
		<processor>
			<name>
				<xsl:value-of select="concat($processorName,'_DataInputs')" />
			</name>
			<inputPorts>
				<xsl:for-each select="./inputTerminals[@isConnected='true']">
				<port>
				<!-- It seems that multiple inputs write the value should be input, in case of 1 wire then  we need to get the name-->
				<!-- Fixed for multiple ???? -->
				<!-- <name>input</name> -->
					<name><xsl:value-of select="."></xsl:value-of></name>
					<depth>0</depth>
				</port>
				</xsl:for-each>
			</inputPorts>
			<outputPorts>
				<port>
					<name>output</name>
					<depth>0</depth>
					<granularDepth>0</granularDepth>
				</port>
			</outputPorts>
			<annotations />
			<xsl:call-template name="activitiesIn" />	
			<xsl:call-template name="dispatchStackIn"/>
			<xsl:call-template name="iterationStrategyStackIn" />
		</processor>

	</xsl:template>
	<xsl:template name="activitiesIn">
		<!-- This template willy only be called for DataInputs -->
		<!--  called by: xsl:template name='processorDataInputs'  -->
		<!-- <xsl:param name="processorName" /> -->
		<activities>
			<activity>
				<raven>
					<group>net.sf.taverna.t2.activities</group>
					<artifact>wsdl-activity</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLInputSplitterActivity</class>
				<inputMap>
					<xsl:for-each select="./inputTerminals[@isConnected='true']">
						<xsl:element name="map">
					<!--Tried to fix for multiple inputs -->
							<xsl:attribute name="from"><xsl:value-of select="."></xsl:value-of></xsl:attribute>
							<xsl:attribute name="to"><xsl:value-of select="."></xsl:value-of></xsl:attribute>
						</xsl:element>
					</xsl:for-each>
				<!-- 	<map from="input" to="input" />  -->
				</inputMap>
				<outputMap>
					<map from="output" to="output" />
				</outputMap>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLSplitterConfigurationBean
						xmlns="">
						<inputs>
						<!-- path: ./positions/inputTerminals -->
					
							<!-- <debug><xsl:value-of select="$processorName"></xsl:value-of></debug> -->
							<xsl:for-each select="./inputTerminals">
								<net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityInputPortDefinitionBean>
									<name>
										<xsl:value-of select="./text()"></xsl:value-of>
									</name>
									<depth>0</depth>
									<mimeTypes class="java.util.Collections$SingletonList">
										<element class="string">'text/plain'</element>
									</mimeTypes>
									<allowsLiteralValues>false</allowsLiteralValues>
								</net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityInputPortDefinitionBean>
							</xsl:for-each>
						</inputs>
						<outputs>
							<net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
								<name>output</name>
								<depth>0</depth>
								<mimeTypes class="java.util.Collections$SingletonList">
									<element class="string">'text/xml'</element>
								</mimeTypes>
								<granularDepth>0</granularDepth>
							</net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
							<!--
								<xsl:for-each select="./outputs/*">
								<net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
								<name> <xsl:value-of select="./text()"></xsl:value-of> </name>
								<depth>0</depth> <mimeTypes
								class="java.util.Collections$SingletonList"> <element
								class="string">'text/xml'</element> </mimeTypes>
								<granularDepth>0</granularDepth>
								</net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
								</xsl:for-each>
							-->
						</outputs>
						<wrappedTypeXML><xsl:value-of select="./wrapperXML/DataInputs/text()"></xsl:value-of></wrappedTypeXML>
					</net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLSplitterConfigurationBean>
				</configBean>
				<annotations />
			</activity>
		</activities>
	</xsl:template>
	<xsl:template name="dispatchStackIn">
		<!-- Nothing to change here, just generic Taverna stuff -->
		<dispatchStack>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Parallelize</class>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig
						xmlns="">
						<maxJobs>1</maxJobs>
					</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig>
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ErrorBounce</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Failover</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Retry</class>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig
						xmlns="">
						<backoffFactor>1.0</backoffFactor>
						<initialDelay>1000</initialDelay>
						<maxDelay>5000</maxDelay>
						<maxRetries>0</maxRetries>
					</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig>
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Invoke</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
		</dispatchStack>
	</xsl:template>
	<xsl:template name="iterationStrategyStackIn">
		
		<iterationStrategyStack>
			<iteration>
				<strategy>
					<cross>
						<xsl:for-each select="./inputTerminals[@isConnected='true']">
						<xsl:element name="port">
							<xsl:attribute name="name"><xsl:value-of
								select="." /></xsl:attribute>
							<xsl:attribute name="depth"><xsl:value-of
								select="'0'" /></xsl:attribute>
						</xsl:element>
						</xsl:for-each>
					</cross>
				</strategy>
			</iteration>
		</iterationStrategyStack>
	</xsl:template>
	
	<xsl:template name="iterationStrategyStackOut">
		<iterationStrategyStack>
			<iteration>
				<strategy>
					<!-- the port name is always the input  -->
					<cross>
						<port name="input" depth="0" />
					</cross>
				</strategy>
			</iteration>
		</iterationStrategyStack>
	</xsl:template>
	
	<xsl:template name="processorProcessOutputs">
		<xsl:param name="processorName"></xsl:param>
		<!--
			this template
			calls:<activitiesOut>,<dispatchStackOut>,<iterationStrategyStackOut>
		-->
		<processor>
			<name>
				<xsl:value-of select="concat($processorName,'_ProcessOutputs')" />
			</name>
			<inputPorts>
				<port>
					<name>input</name>
					<depth>0</depth>
				</port>
			</inputPorts>
			<outputPorts>
				<xsl:for-each select="./outputTerminals[@isConnected='true']">
					<port>
					<!-- Attention it also needs to be mapped -->
					<!-- <outputTerminals isConnected="true">stdoutResult</outputTerminals>  -->				
					<name><xsl:value-of select="."></xsl:value-of></name>
					<depth>0</depth>
					<granularDepth>0</granularDepth>
				</port>
				</xsl:for-each>
			</outputPorts>
			<annotations />
			<xsl:call-template name="activitiesOut">
				<!--
					<xsl:with-param name="processorName" select="$processorName" />
				-->
			</xsl:call-template>
			<xsl:call-template name="dispatchStackOut" />
			<xsl:call-template name="iterationStrategyStackOut">
			<!-- 	<xsl:with-param name="crossPortName" select="'input'" />  -->
			</xsl:call-template>
		</processor>

	</xsl:template>
	<xsl:template name="activitiesOut">
		<activities>
			<activity>
				<raven>
					<group>net.sf.taverna.t2.activities</group>
					<artifact>wsdl-activity</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLOutputSplitterActivity</class>
				<inputMap>
					<map from="input" to="input" />
				</inputMap>
				<outputMap>
				<!--  multiple maping as like input -->
				 <xsl:for-each select="./outputTerminals[@isConnected='true']">
				 	<!-- <map from="outputResult" to="outputResult" />  -->
				 	<xsl:element name="map">
				 		<xsl:attribute name="from"><xsl:value-of select="." /></xsl:attribute>
				 		<xsl:attribute name="to"><xsl:value-of select="."/></xsl:attribute>
				 	</xsl:element>
					
				</xsl:for-each>
				</outputMap>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLSplitterConfigurationBean
						xmlns="">
						<inputs>
							<net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityInputPortDefinitionBean>
								<name>input</name>
								<depth>0</depth>
								<mimeTypes class="java.util.Collections$SingletonList">
									<element class="string">'text/xml'</element>
								</mimeTypes>
								<handledReferenceSchemes />
								<translatedElementType>java.lang.String</translatedElementType>
								<allowsLiteralValues>false</allowsLiteralValues>
							</net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityInputPortDefinitionBean>
						</inputs>
						<outputs>
						
							<xsl:for-each select="./outputTerminals">
								<net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
									<name>
										<xsl:value-of select="./text()"></xsl:value-of>
									</name>
									<depth>0</depth>
									<mimeTypes class="java.util.Collections$SingletonList">
										<element class="string">'text/xml'</element>
									</mimeTypes>
									<granularDepth>0</granularDepth>
								</net.sf.taverna.t2.workflowmodel.processor.activity.config.ActivityOutputPortDefinitionBean>
							</xsl:for-each>

						</outputs>
						<!-- need to check this -->
						<wrappedTypeXML><xsl:value-of select="./wrapperXML/ProcessOutputs/text()"></xsl:value-of></wrappedTypeXML>
					</net.sf.taverna.t2.activities.wsdl.xmlsplitter.XMLSplitterConfigurationBean>
				</configBean>
				<annotations />
			</activity>
		</activities>
	</xsl:template>
	<xsl:template name="dispatchStackOut">
		<!-- Nothing special here -->
		<dispatchStack>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Parallelize</class>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig
						xmlns="">
						<maxJobs>1</maxJobs>
					</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ParallelizeConfig>
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.ErrorBounce</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Failover</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Retry</class>
				<configBean encoding="xstream">
					<net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig
						xmlns="">
						<backoffFactor>1.0</backoffFactor>
						<initialDelay>1000</initialDelay>
						<maxDelay>5000</maxDelay>
						<maxRetries>0</maxRetries>
					</net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.RetryConfig>
				</configBean>
			</dispatchLayer>
			<dispatchLayer>
				<raven>
					<group>net.sf.taverna.t2.core</group>
					<artifact>workflowmodel-impl</artifact>
					<version>1.3</version>
				</raven>
				<class>net.sf.taverna.t2.workflowmodel.processor.dispatch.layers.Invoke</class>
				<configBean encoding="xstream">
					<null xmlns="" />
				</configBean>
			</dispatchLayer>
		</dispatchStack>
	</xsl:template>
	<xsl:template name="dataLinksProcess">
		<datalink>
				<sink type="processor">
					<processor><xsl:value-of select="./label/text()" /></processor>
					<port>DataInputs</port>
				</sink>
				<source type="processor">
					<processor><xsl:value-of select="concat(./label/text(),'_DataInputs')" /></processor>
					<port>output</port>
				</source>
			</datalink>
			<datalink>
				<sink type="processor">
					<processor><xsl:value-of select="concat(./label/text(),'_ProcessOutputs')"/></processor>
					<port>input</port>
				</sink>
				<source type="processor">
					<processor><xsl:value-of select="./label/text()" /></processor>
					<port>ProcessOutputs</port>
				</source>
			</datalink>
	</xsl:template>
	<xsl:template name="dataLinksActual">
			<!-- template get the wires nodes -->
			<xsl:choose>
				<!-- Case its a pure service-to-service connection-->
				<xsl:when test="./src/xtype/text()='WireIt.TavernaContainer' and ./tgt/xtype/text()='WireIt.TavernaContainer'">
				<!-- removing it for now -->
				<datalink>
					<sink type="processor">
						<processor><xsl:value-of select="concat(./tgt/moduleId/text(),'_DataInputs')" /></processor>
						<port><xsl:value-of select="./tgt/terminal/text()" /></port>
					</sink>
					<source type="processor">
						<processor><xsl:value-of select="concat(./src/moduleId/text(),'_ProcessOutputs')" /></processor>
					<port><xsl:value-of select="./src/terminal/text()" /></port>
				</source>
			</datalink>
			 
				</xsl:when>
				<xsl:otherwise> <!-- EITHER service-2-output or input-2-service -->
					<xsl:choose> <!-- Case input-2-service -->
						<xsl:when test="./src/xtype/text()='input'">
							<datalink>
							<sink type="processor">
								<processor><xsl:value-of select="concat(./tgt/moduleId/text(),'_DataInputs')" /></processor>
								<port><xsl:value-of select="./tgt/terminal/text()" /></port>
							</sink>
							<source type="processor">
								<processor><xsl:value-of select="./src/moduleId/text()" /> </processor>
								<!-- standard identification value -->
								<port><xsl:value-of select="'value'" /></port>
							</source>
							</datalink>
						</xsl:when>
						<xsl:otherwise> <!--  Case service-2-output -->	
							<datalink>
								<sink type="dataflow">
								<!-- Not certain if it should have just name output or modelId label -->
								<!-- <port>output</port>  -->
									<port><xsl:value-of select="./tgt/moduleId/text()"/></port>
								</sink>
							<source type="processor">
								<processor><xsl:value-of select="concat(./src/moduleId/text(),'_ProcessOutputs')" /></processor>
								<port><xsl:value-of select="./src/terminal/text()" /></port>
							</source>
								</datalink>
						</xsl:otherwise><!-- end if service-2-output -->
					</xsl:choose>
				
				
				</xsl:otherwise><!-- End service-2-output or input-2-service  -->
			</xsl:choose>
	</xsl:template>
	<xsl:template name="annotations">
	<annotations>
			<annotation_chain_2_2 encoding="xstream">
				<net.sf.taverna.t2.annotation.AnnotationChainImpl
					xmlns="">
					<annotationAssertions>
						<net.sf.taverna.t2.annotation.AnnotationAssertionImpl>
							<annotationBean
								class="net.sf.taverna.t2.annotation.annotationbeans.IdentificationAssertion">
								<identification><xsl:value-of select="$uuid" /></identification>
							</annotationBean>
							<!-- 2011-08-25 16:03:36.21 BST  -->
							<date><xsl:value-of select="$date" /></date>
							<creators />
							<curationEventList />
						</net.sf.taverna.t2.annotation.AnnotationAssertionImpl>
					</annotationAssertions>
				</net.sf.taverna.t2.annotation.AnnotationChainImpl>
			</annotation_chain_2_2>
		</annotations>
	
	
	</xsl:template>
	
	
</xsl:stylesheet>

