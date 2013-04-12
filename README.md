s4
==

# Description
Septima Search for Spatial Suite


# License


1. Installation

NOTE: Never change content of s4 module. Instead, create a custom module with changes only. See later in this document


1.a Copy the module to [cbinfo.config.dir]/modules/septima/s4
2.b 	Update modules.xml by adding:
```xml
<module name="s4" dir="custom/s4" permissionlevel="public"/>
```
2.c Comment out other modules conflicting with this module e.g.:
```xml
<!--     <module name="afstand" dir="standard/dk/afstand" permissionlevel="public"/> -->
<!--     <module name="spatialaddress" dir="standard/dk/spatialaddress" permissionlevel="public"/>    -->
```

2.d Include tool in profile(s):
```xml
<tool module="s4" name="s4-plugin" />
```
2.e Comment out other tools conflicting with this tool e.g.:

```xml
<!--     <tool module="spatialaddress" name="spatialaddress-plugin" /> -->
```

