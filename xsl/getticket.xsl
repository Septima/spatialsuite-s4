<?xml version="1.0" encoding="UTF-8"?>
<!-- <pcollection> -->
<!-- <pcomposite name="result" pcolid="{7315B0F7-13E0-CA46-C544-F5B002E6FAFF}"> -->
<!-- <col name="expressionresult">e49a7a35a32a220cb7fba36c5608c3d2</col> -->
<!-- </pcomposite> -->
<!-- </pcollection> -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <xsl:apply-templates select="//col[@name='expressionresult']"/>
    </xsl:template>
    <xsl:template match="//col[@name='expressionresult']">
    	<xsl:value-of select="."/>
    </xsl:template>
</xsl:stylesheet>
