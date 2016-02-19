Septima.Search.ThemeSearcher = Septima.Class (Septima.Search.Searcher, {

	themeOffUri: null,
	themeOnUri: null,
	onCustomButtonDef: null,
	offCustomButtonDef: null,
	themePhrase: null,
	themesPhrase: null,
	showPhrase: null,
	hidePhrase: null,

	groups: [],
    initialize: function (options) {
		this.Searcher(options);
		this.visibleThemesPhrase = cbInfo.getString('s4.themesearcher.visiblethemes');
		this.toolsPhrase = cbInfo.getString('s4.themesearcher.tools');
    	this.themePhrase = cbInfo.getString('s4.themesearcher.theme');
    	this.themesPhrase = cbInfo.getString('s4.themesearcher.themes');
    	this.showPhrase = cbInfo.getString('s4.themesearcher.show');
    	this.hidePhrase = cbInfo.getString('s4.themesearcher.hide');
    	this.showLockedPhrase = cbInfo.getString('s4.themesearcher.show_locked');
    	this.hideLockedPhrase = cbInfo.getString('s4.themesearcher.hide_locked');
		this.themeOffUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUU3MDY1OTM4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUU3MDY1OTQ4M0Q1MTFFMTgyRjlDOEI4MjU5RkU3RjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RTcwNjU5MTgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RTcwNjU5MjgzRDUxMUUxODJGOUM4QjgyNTlGRTdGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plr+f/0AAAIsSURBVHjabFO7iiJREK1uX6soCEYyIia+RhEDOzAQAzG3zfwFf2KYYH5EhM7UxMBAA0EMdhVcZAInU0dUMBDF92Orir3SsnugrEt5T9WpqtvS/X4HPRqNRsxkMr3LspyQJMlzu93gdDpNz+fzL7Q3VVV/6+9L+gStVquKxNxyuYTNZgNEJmAMrFYr2O12uFwutXw+rz4lWK/XPwaDwRd6z3w+fyQ0m83sUcEjRkkwPnU6nf5MJnOQKdjr9TQ92efzscdKbFRExLbbLRwOBw+q1Fhdu91WSLYgp9NpyGazgP2Cw+Fgo3Yolkql+M5ut6OkuXK5rMjH4/GDehaVA4HAo5LA9XplHwqFwO128xl5NKMP2WKxvFIFgt/vZ99sNtlTHFvjc7fbZR8MBlkdDpNUvMr48yKmLfocDodgs9mgUqlAqVQCg8EAo9HoUYSq/1X2YhTkp91KEm+Apo8K2fQgBQQaroxZvmnPhNlsxj4SiTwlIxOzGY/H+tl8y/v9/pMeCaHf77PH/UI4HGYVZNFoFJLJJP/X6XTAaDTyGdV/SvV6PYED+blYLDgYj8dBURT4H4hMRqslVZhA4ZeIw6riYHJidS6XCxKJBHi93odsIk4mE37SpArl14rFospacLcF7P8LJ++hR7JarQCVAbbH6yKQbKpM80LyFO8V/vmYNE2r0gujNQmiHvSgUDZXFjFZf6FQKKhIjOHea/TB0P6pIiadEhF9TE8m/BFgAKvfRvljFZCQAAAAAElFTkSuQmCC";
		this.themeOffLockUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODY4Q0UzMTE4N0M2MTFFMThFQThDNzVFQjI1MUMxNjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODY4Q0UzMTI4N0M2MTFFMThFQThDNzVFQjI1MUMxNjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NjhDRTMwRjg3QzYxMUUxOEVBOEM3NUVCMjUxQzE2MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NjhDRTMxMDg3QzYxMUUxOEVBOEM3NUVCMjUxQzE2MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmqwWhUAAAHWSURBVHjadFO/jwFBFJ5dSxASEgqJ9hqF6u7+g6vZSk6jplZpNlvo/AEKjQKV2L9DrrpCoyUaEgniN/d9k8xmsfclk3nzZt4373vzRrvf78KL4XCY13Xd1jTtHcss96/X6wzjB8Mql8u/3vOal2AEILi43W7F8XgUag9kwjAMEQqFxO12c0BiPhCMx+PwYrGYIii72WxcQgYQp9PJ9QWDQYFLZpjfSqXSwaBzPp8PzufzQ3ChUHiQ1uv1RDgcljayyULOAKapOY7zAWO8XC5fglutlpzr9bqcO52OSCaTUk4gEKDETx1MTWp+BoMvl4uIxWKi3W5L33q9FofDQdqoBUfTAFOOBfNDIpEQ6XT6wQepro0MchoKf1+tVv9qfwazISllMAv9uQ+8sCzLrYOCVwZjdbDM+c5+YA1U5RX2+72UwRjG6lhMmI4f6GcR/YDic5oYYGqgYb68xVGwbds3mNpJgLkhO7Hf74+QbpEkfFJ0pWBTMYNIJOKmTknxeFwWMRqNOtVq1ZS549D3brebssOoOZPJiFQq5XszGwjnZjj//fKZut3uCOsiD6oqq8/ElDngc2q1mum+gveGSqViwpmH6YBkprRCGr+zA3+eaTNQkf8JMABtLCdVRDzcPAAAAABJRU5ErkJggg==";
		this.themeOnUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAq1JREFUeJxlk09oVFcUxn/3vskkqZoJGRMXTgQpCga0qZkUChEtFjFg6giuVDAgbaQroV2WGgUXXQiudJlVyDJpKRVKwYR0YXVqtNrUP1SSOMYRJpjJjJn3Zubc08Uzk4n94HDh8N1zzvcdjlFV6rHn75P7oqbhkqc26WET4oTAlTOBq6QDV774oufmX/V8U1+ge/bUuGdsaiHI8kYKCAKAh2UzzcS1hYqrTix8cvPEhgLfZq41TRXuPctVlxNz5cVawVZvCwDLUqjl4rKFZolmtr9t23X78zHfAvy2cmes/nOq9RAAM12jzOwZBbeeW/IKFE0p8W9TdgyA5OyZ3v2zp5V0j5Lu0ZHcT6qqyvTHugZ+3quqqiPZH2u8rVMHte3WgV7ru/KVhSBb6zwYHwhnXaqsO1UNfRrc9gWpyAEAilGfipErttk0dr15p/Fs/BgAFx7+AMBceZG51VDWhRdXQ07HAJQcQUQwFe0yyUdnNO3/A4D2pEPzfvmU/CafWCwGr8vkq0Vi29tY7p4Mnf/1I4g3sDkXISJOeB8GAx945KUIbQDRMLeGkgNA1GGrTl56WAAmC3+GY3YeXyfbMNbkTebuvts/iJOX3qavdh4VdR8GVJgrLzIYH+Dotj7y/gqPK/M02UbOt5/kWuc3oZEz3zEvWaz1UHF/mN3p48mqyt3n5hUAFzu+ZLhz6H+yAIYfX+fSkxvQ3kAkr4iTXqOq7LjTP76Kn1rywm0ctN0Mdw5xaGtvbezhJ9eZyqWhJYLFoL5MuP4HJ4yqcnj6XNPTSOZZ0ZQSyw2rYbvAwYqEL0CjhRYPG4CuSkbnS7v066f+hmNq//2zcZymilGfICKo0ZphxgdbEAQ34fofbDymesSm+/YiellFk1p1CVGHIBkxLu2Mfu+O3H9Yz/8PLFlkbIqvT3MAAAAASUVORK5CYII=";
		this.themeOnLockUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzI2N0VCNUQ4N0M2MTFFMThFN0FBRkFEMkMyMUQzNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzI2N0VCNUU4N0M2MTFFMThFN0FBRkFEMkMyMUQzNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MjY3RUI1Qjg3QzYxMUUxOEU3QUFGQUQyQzIxRDM2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MjY3RUI1Qzg3QzYxMUUxOEU3QUFGQUQyQzIxRDM2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjgdAV8AAAIsSURBVHjadFNBaxNBFH4zu9kmTarFth50ETz00IIiuPbkRVChgpCAIin9BZ499aAo9O7JPyCYYwKCvfQiCkpYilaNYpFK3UrRlqZmE3c3O298s6txN0m/Pczu23nffN97b5iUEpKY+XDjrMEy9zXJLQ24KVCAj4HjY9em9d638yvryf0sSXCusVDVGC9u+TuwL1og6FEgIihADibkEehiWNuaWymlCO44D7PPW2sbu2HT/Bp87xGOa2PR2iSyf5gQY5AThnOyfWz69eWKp6vg6q965UC4qWR75nHKmvWqDJDnsJdpwTiOml+yOxUKl5jVWLyAIOtrnU8DydaTWKm9UI2/V28BHKczMxwm2wVAxDnuYbCsPPcjSu4i+dDBenYzDv4IANoYvbqGB10mlvUcG5ndT3hMYcoAMI10LIgJfF2A4fJZZr1flLb38VDvA8qUGkVKNgq7OnDV50M3P7req0MPP//bEBKBhyi2VZ+HQtUg3/dPJZMNRuNDh29zFzsNNSRDQTJVEYeBeUSgY0PPoLZEE3blgLUHNtm3nw4nJgW8JZSCpWgST9Xnqx3winsadaMZAmx68WowgFEtTupQrQIZKeKTBsgRVsP5t6VI37R/ovxZdzbUhDXzLsDpbK9dAydLDnSmIzd/lwcu09TLS1VAWVRDovosmfx7YWLPkWzAmry2HrVG5bL+63z0xcUz1J8HUkhLhmiqVlGaIxjayORdvPrmXXL/HwEGAE3LGHmeNfKIAAAAAElFTkSuQmCC";
		//this.toolsIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGSSURBVCjPVVFNSwJhEF78Ad79Cf6PvXQRsotUlzKICosuRYmR2RJR0KE6lBFFZVEbpFBSqKu2rum6llFS9HHI4iUhT153n6ZtIWMOM+/MM88z7wwH7s9Ub16SJcnbmrNcxVm2q7Z8/QPvEOtntpj92NkCqITLepEpjix7xQtiLOoQ2b6+E7YAN/5nfOEJ2WbKqOIOJ4bYVMEQx4LfBBQDsvFMhUcCVU1/CxVXmDBGA5ZETrhDCQVcYAPbyEJBhvrnBVPiSpNr6cYDNCQwo4zzU/ySckkgDYuNuVpI42T9k4gLKGMPs/xPzzovQiY2hQYe0jlJfyNNhTqiWDYBq/wBMcSRpnyPzu1oS7WtxjVBSthU1vgVksiQ3Dn6Gp5ah2YOKQo5GiuHPA6xT1EKpxQNCNYejgIR457KKio0S56YckjSa9jo//3mrj+BV0QQagqGTOo+Y7gZIf1puP3WHoLhEb2PjTlCTCWGXtbp8DCX3hZuOdaIc9A+aQvWk4ihq95p67a7nP+u+Ws+r0dql9z/zv0NCYhdCPKZ7oYAAAAASUVORK5CYII=";
		this.toolsIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABJ0AAASdAHeZh94AAAAB3RJTUUH3wsEEBQCC4i3FQAAAUpJREFUOMvNlKFLREEQh7/xwFcERRBEDIIWqxjNgs1kMBuMnuH6/QNmm15QEFFBLXIIBxaLQTQopxYth+XQYFBYyywMc2/fnXDBheG9/c3Ox775DU9CCPRzDdDnlQSKyKSINEQkS+TnREQ6EiGEjgAEeAYCcA+Mmdyq6q3c2gRwV4tibKk+rvsXYKQnIFAxoE+ganKnqm8bbRhYywUCU8C3AV66fE31N73tIHADnKeAO1pwAjT1fc/kL1wrYiymgO0IADJjzD5wZABf+mwD5WQPgQdg1uwz4Mndpg7MAAvAaKEpwDRQclrdATfz3C0cGwO7TvRs409Ade/WAB6BQwet9jqHJeDdFDbjEAMHDlru1sMh4NUU/AAT7kyjqKceeKczGICPPBf13LGDrqeALWBZD813McxCr1LAFeDMf2YBtKYtWoqa/Ps/9i9UVjseslrp0QAAAABJRU5ErkJggg==";
		this.layersIconUri = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDE2TDE5LjM2LDEwLjI3TDIxLDlMMTIsMkwzLDlMNC42MywxMC4yN00xMiwxOC41NEw0LjYyLDEyLjgxTDMsMTQuMDdMMTIsMjEuMDdMMjEsMTQuMDdMMTkuMzcsMTIuOEwxMiwxOC41NFoiIC8+PC9zdmc+";
		this.iconURI = this.layersIconUri;
		this.defaultThemeIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDE2TDE5LjM2LDEwLjI3TDIxLDlMMTIsMkwzLDlMNC42MywxMC4yN00xMiwxOC41NEw0LjYyLDEyLjgxTDMsMTQuMDdMMTIsMjEuMDdMMjEsMTQuMDdMMTkuMzcsMTIuOEwxMiwxOC41NFoiIC8+PC9zdmc+";
		this.onCustomButtonDef= [{"buttonText": this.hidePhrase, "buttonImage": this.themeOnUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offCustomButtonDef= [{"buttonText": this.showPhrase, "buttonImage": this.themeOffUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.onLockCustomButtonDef= [{"buttonText": this.hideLockedPhrase, "buttonImage": this.themeOnLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];
		this.offLockCustomButtonDef= [{"buttonText": this.showLockedPhrase, "buttonImage": this.themeOffLockUri, "callBack": Septima.bind( this.toggleTheme, this)}];

    	this.groups = [];
    	this.datasources = {};
    	for (var i=0;i<cbKort.themeContainer.elements.length;i++){
    		var group = cbKort.themeContainer.elements[i];
    		var groupHasThemes = false;
    		var themes = [];
    		for (var j=0;j<group.elements.length;j++){
    			var theme = group.elements[j];
    			if (theme.selectable=="true"){
    				for (l=0;l<theme.layers.length;l++){
    					var layer = theme.layers[l];
    					if (layer.datasource){
        					if (typeof this.datasources[layer.datasource] === 'undefined'){
        						this.datasources[layer.datasource] = [];
        					}
        					this.datasources[layer.datasource].push(theme);
    					}
    				}
    				groupHasThemes = true;
    				var themeDescription = this.getThemeDescription(theme);
    				var terms = (theme.displayname + " " + themeDescription).split(" ");
    				var termsToSearch = [];
    				for (var k=0;k<terms.length;k++){
    					term = terms[k];
    					if (term.length > 1){
    						termsToSearch.push(term.toLowerCase());
    					}
    				}
        			themes.push({"group": group, "theme": theme, "termsToSearch": termsToSearch, "description": themeDescription, "image": this.getThemeImage(theme), "displayname": theme.displayname});
    			}
    		}
    		if (groupHasThemes){
    			//sort themes
    			themes.sort(function(t1, t2){
    				return (t1.displayname.localeCompare(t2.displayname));
    			});
        		this.groups.push({"group": group, "themes": themes, "displayname": group.displayname.replace(/:/g, "") + " (" + this.themesPhrase +")"});
    			this.registerTarget(group.displayname.replace(/:/g, "") + " (" + this.themesPhrase +")")
    		}
    	}
		this.registerTarget(this.visibleThemesPhrase);
    	
    	//Sort groups
    	this.groups.sort(function(g1, g2){
			return (g1.displayname.localeCompare(g2.displayname));
		});
    	
    	this.getLocalThemesDeferred = jQuery.Deferred();

    	this.getLocalDatasources().done(Septima.bind(function(localDatasources){
        	localThemesArray = [];
        	localThemesString = "";
    		for (var i=0;i<localDatasources.length;i++){
    			var localDatasource = localDatasources[i];
    			if (typeof this.datasources[localDatasource] !== "undefined"){
    				var themesArray = this.datasources[localDatasource];
    				for (var j=0;j<themesArray.length;j++){
    					localThemesArray.push(themesArray[j].name);
    				}
    			}
    		}
    		localThemesString = localThemesArray.join(" ");
    		this.getLocalThemesDeferred.resolve(localThemesString);
    	}, this));
    },
    
    getThemesForDatasource: function(datasource){
        var queryResult = this.createQueryResult();
		if (typeof this.datasources[datasource.id] !== 'undefined'){
			for (var i=0;i<this.datasources[datasource.id].length;i++){
				var theme = this.datasources[datasource.id][i];
        		var result = queryResult.addResult(theme.displayname + " (" + this.themePhrase + ")", theme.description, " ", {theme: theme});
        		result.image = this.getThemeImage(theme);
			}
		}
		return queryResult;
    },
    
    getLocalthemes: function(){
    	return this.getLocalThemesDeferred.promise();
    },
    
    getVisibleThemes: function(){
    	var visibleThemes = [];
    	for (var i=0;i<this.groups.length;i++){
    		var group = this.groups[i];
    		for (var j=0;j<group.themes.length;j++){
    			var theme = group.themes[j];
    			if (theme.theme.visible){
    				visibleThemes.push(theme);
    			}
    		}
    	}
    	return visibleThemes;
    },
    
    toggleTheme: function(result){
    	var scale = cbKort.getState().map.scale;
    	var theme = result.data.theme;
    	if (theme.visible){
    		cbKort.setThemeVisibility(theme.name, false, true);
        	if (typeof cbKort.themeSelector.setSpatialMapState !== 'undefined'){
            	cbKort.themeSelector.setSpatialMapState();
        	}
        	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            	return this.offLockCustomButtonDef[0];
        	}else{
            	return this.offCustomButtonDef[0];
        	}
    	}else{
    		cbKort.setThemeVisibility(theme.name, true, true);
        	if (typeof cbKort.themeSelector.setSpatialMapState !== 'undefined'){
            	cbKort.themeSelector.setSpatialMapState();
        	}
        	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
        		return this.onLockCustomButtonDef[0];
        	}else{
        		return this.onCustomButtonDef[0];
        	}
    	}
    },
    
    getThemeDescription: function(theme){
    	for (var i=0;i<theme.copyright.length;i++){
    		if (theme.copyright[i].name == "metadata.text"){
    			return theme.copyright[i].value;
    		}
    	}
    	return "";
    },
    
    getThemeImage: function(theme){
    	if (theme.img !== ""){
    		return theme.img; 
    	}
    	for (var i=0;i<theme.copyright.length;i++){
    		if (theme.copyright[i].name == "img"){
    			return theme.copyright[i].value;
    		}
    	}
    	return this.defaultThemeIconURI;
    },
    
    fetchData: function (query, caller) {
    	var groupName = "*";

        var queryResult = this.createQueryResult();
        
    	if (query.hasTarget){
    		if (this.hasTarget(query.target)){
    			groupName = query.target;
    		}else{
    			var result = queryResult.addNewQuery(this.visibleThemesPhrase, this.visibleThemesPhrase, this.visibleThemesPhrase + ":", null, null, null);
	        }
    	}
    	
        if (groupName == this.visibleThemesPhrase){
        	var visibleThemes = this.getVisibleThemes();
        	for (var i=0;i<visibleThemes.length;i++){
        		var theme = visibleThemes[i];
        		var result = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
        		result.image = theme.image;
        	}
        }else{
        	var groupsWithMatchingNames = [];
        	var groupsWithMatchingThemes = [];
        	var nameMatchingThemes = [];
        	var queryTerms = query.queryString.split(" ");
        	if (queryTerms.length>0){
        		groupsWithMatchingThemes = this.getGroupsWithMatchingThemes(queryTerms, groupName);
        		var totalThemeCount = 0;
        		for (var i=0;i<groupsWithMatchingThemes.length;i++){
        			totalThemeCount += groupsWithMatchingThemes[i].themes.length;
        		}
        		if (query.type == "list.force" || totalThemeCount<query.limit){
        			var themesToShow = [];
        			for (var i=0;i<groupsWithMatchingThemes.length;i++){
        				themesToShow = themesToShow.concat(groupsWithMatchingThemes[i].themes);
        			}
        			themesToShow.sort(function(a, b){
    					if (a.score == b.score){
    						return a.theme.displayname.localeCompare(b.theme.displayname)
    					}else{
        					return b.score - a.score;
    					}
    				});
    				for (var j=0;j<themesToShow.length;j++){
    					theme = themesToShow[j];
    					var result1;
    					if (query.hasTarget){
        					result1 = queryResult.addResult(theme.theme.displayname, theme.description, " ", theme);
    					}else{
        					result1 = queryResult.addResult(theme.theme.displayname + " (" + this.themePhrase + ")", theme.description, " ", theme);
    					}
                        result1.image = theme.image;
    				}
        		}else if (query.type == "list"){
            		var freeSlots = query.limit - groupsWithMatchingThemes.length;
            		if (groupsWithMatchingThemes.length > freeSlots && !query.hasTarget){
            			var description = null;
//            			if (query.queryString.length > 0){
//            				description = totalThemeCount + " " + this.themesPhrase + " " + this.getMatchesPhrase() +" <em>" + query.queryString + "</em>";
//            			}
    					var result3 = queryResult.addNewQuery(this.title + " (" + totalThemeCount + ")", description, query.queryString, null, null, null)
            		}else{
            			for (var i=0;i<groupsWithMatchingThemes.length;i++){
            				var group = groupsWithMatchingThemes[i];
            				if (group.themes.length==1 || group.themes.length<freeSlots){
            					//TODO: list all themes
            					for (var j=0;j<group.themes.length;j++){
                					theme = group.themes[j];
                					var result1;
                					if (query.hasTarget){
                    					result1 = queryResult.addResult(theme.displayname, theme.description, " ", theme);
                					}else{
                    					result1 = queryResult.addResult(theme.displayname + " (" + this.themePhrase + ")", theme.description, " ", theme);
                					}
                                    result1.image = theme.image;
            					}
            					freeSlots -= group.themes.length;
            				}else{
            					var count = group.themes.length;
            					var groupDescription = "";
            					for (var k=0;k<count;k++){
            						groupDescription += group.themes[k].displayname + ", ";
            					}
            					//TODO: Encode group.group.displayname to avoid ":" in groupname (destroys target computation) &#58;
            					var target = group.group.displayname.replace(/:/g, "");
            					var result3 = queryResult.addNewQuery(group.group.displayname + " (" + count + " " + this.themesPhrase + ")", groupDescription, target + ": " + query.queryString, null, null, null)
            				}
            			}
            		}
        		}

        	}
             	
        }
   	
    	setTimeout(Septima.bind(function (caller, queryResult){caller.fetchSuccess(queryResult);}, this, caller, queryResult), 100);
    },
    
    getGroupsWithMatchingThemes: function (queryTerms, groupName){

    	var groupsWithMatchingThemes = [];
        	for (var j=0;j<this.groups.length;j++){
        		var group = this.groups[j];
        		if (groupName == "*" || group.displayname.toLowerCase() == groupName.toLowerCase()){
            		var themes = [];
            		for (var k=0;k<group.themes.length;k++){
            			var theme = group.themes[k];
            			theme.score = 0;
            	       	for (var i=0;i<queryTerms.length;i++){
            	    		var term = queryTerms[i].toLowerCase();
                			if (theme.theme.displayname.toLowerCase().indexOf(term)==0){
                				theme.score += 2;
                			}else if (this.match(term, theme.termsToSearch)){
                				theme.score += 1;
                			}
            	    	}
            			if (theme.score > 0){
        					themes.push(theme);
            			}
            		}
            		if (themes.length>0){
            			themes.sort(function(a, b){
        					if (a.score == b.score){
        						return a.theme.displayname.localeCompare(b.theme.displayname)
        					}else{
            					return b.score - a.score;
        					}
        				});
                		groupsWithMatchingThemes.push({"group": group, "themes": themes});
            		}
        		}
        	}
        	
    	return groupsWithMatchingThemes;
    },
    
    match: function(testTerm, terms){
    	for (var i=0;i<terms.length;i++){
    		if (terms[i].indexOf(testTerm)==0){
    			return true;
    		}
    	}
    	return false;
    },
	
	getCustomButtonDefs: function(result){
        if (typeof result.newquery !== 'undefined'){
        	return [];
        }else{
        	var scale = cbKort.getState().map.scale;
        	var theme = result.data.theme;
        	if (theme.visible){
            	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            		return this.onLockCustomButtonDef;
            	}else{
            		return this.onCustomButtonDef;
            	}
        	}else{
            	if ((theme.maxscale != null && scale > theme.maxscale) || (theme.minscale != null && scale < theme.minscale)) {
            		return this.offLockCustomButtonDef;
            	}else{
            		return this.offCustomButtonDef;
            	}
        	}
        }
	},
	
	hasdetailHandlerDefs: function(result){
        if (typeof result.newquery !== 'undefined'){
            return false;
        }else{
        	if (result.data.theme.actions == undefined || result.data.theme.actions.length == 0){
                return false;
        	}else{
                return true;
        	}
        }
	},

    getdetailHandlerDefs: function(result){
        if (typeof result.newquery !== 'undefined' || result.data.theme.actions == undefined || result.data.theme.actions.length == 0){
            return [];
        }else{
        	return ([{"buttonText": this.toolsPhrase, "buttonImage": this.toolsIconURI, "handler": function(result, deferred){
        		var buttons = jQuery("<ul style='list-style: none'/>");
        		for (var i=0;i<result.data.theme.actions.length;i++){
        			var button = result.data.theme.actions[i].getGuiButton(result.data.theme);
        			button.element.css("float", "left");
        			button.element.css("list-style", "none");
        			button.element.css("padding", "4px");
        			button.element.css("margin", "2px");
        			buttons.append(button.element);
        		}
        		var copyRightLink = result.searcher.getCopyRightLink(result);
        		if (copyRightLink !== null){
        			buttons.append(copyRightLink);
        		}
        		deferred.resolve(buttons);
        	}}]);
        }
    },
    
    getCopyRightLink: function(result){
    	var link = null;
    	if (result.data.theme.copyright !== 'undefined' && result.data.theme.copyright.length>1){
    		var text = null;
    		var url = null;
    		var copyrightparts = result.data.theme.copyright; 
    		for (var i=0;i<copyrightparts.length;i++){
    			var copyrightpart = copyrightparts[i];
    			if (copyrightpart.name == 'copyright-text'){
    				text = copyrightpart.value;
    			}else if (copyrightpart.name == 'copyright.url'){
    				url = copyrightpart.value;
    			}
    		}
    		var copyRightIconUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvZJREFUeNq0lV9IU1Ecx6eog+7CLsUGZelSuEIbg1uyQNZLIOxBUUIEQVIDH0T26EuCPuxl81V8MqUJgVJqIQ6kIDaGirUcOthAvdpmc6PcpBasSev3jXPgMjSE6sBn5/zOn+859/x+v7OSQqGgKSqlxHXCTBiJq8RF4ivxiVCITSJG/CxeXFIkqCXuEPeYmIA5qnFMzjJRH/GOyJ0leJl4QDQS5ejY29sTYrGYwCeYTKaMKIo/mJknAsQL4kux4BXiEWGB4ff79R6P53YymbwE22AwZHhblmWlu7t7s6amJss0QsQT4jMXvED1Q8KGDpfLJQcCAQkL29raohaLJc1393q9VUtLS9Lh4aHY29u7arfb42zITzwlvmtIsJHwEM8mJyffNzc3F2ZnZ1dhg6Ojo+c+n+81at43PDy8i3kbGxte1udhOmU44WNSvoX7cjgcLXSqYE9PTzQUCokTExPy/v6+np+wsrIy29nZGcTJBgcHbYlEQpyenn7FhsPES4TIDVgzMzMSFkAsnU5XOJ3O+xCrrq5OYZOmpqYtzNvZ2RFR9/f3B4+PjwVcAxOEjqmMfnSwtre3DVarFeGgWVhYMOZyufL6+vq42+328xMODAxs4kvQhlOwGdsgznSMpTzO4EVyQBLtbDZbgbqhoeGgOHBV3tVIkpSKRqP8SqCjL9X8RaGNy09LswKPNXKEAW1BEH4H7/r6+jX1ZNwt/2SUeDwu4pSqLEpB8Busurq65NraGtJN09raqmi12nwkEqnq6upqGRsbM4+MjNzt6+trWVxcvMmzCE6rra3lcQodBYIfYXV0dEThtampKQnpNTo66oVT0Le8vGwKBoNGKkl+z+Pj4zK+ShXc0NmCl9/ifnHZCI/5+XlZp9Pl29vbd9UeVhecVlEUw9DQ0BvWdcJ0IhD8QKwg9RCD8DAFqzUcDutPS725uTlzJpNBEvhUYytM5+TMx4HSz6zOEl7O8zic+/my2WwplfYfn6//8sD+k7+AXwIMAMt2pRoJ8z/kAAAAAElFTkSuQmCC';
    		if (text !== null && url !== null){
    			link = jQuery("<a target='_blank' href='" + url + "' title='" + text + "'><img src='" + copyRightIconUri + "'/></a>");
    			link.css("padding", "4px");
    			link.css("margin", "2px");
    			link.css("top", "4px");
    			link.css("position", "relative");
    		}
    	}
    	return link;
    },
    
    getLocalDatasources: function(){
    	var deferred = jQuery.Deferred();
    	jQuery.ajax({
    		url: '/spatialmap?page=s4GetLocalDatasources&outputformat=json',
            jsonp: 'json.callback',
            data:{sessionId: this.sessionId},
	        dataType: 'jsonp',
            crossDomain : true,
            async:true,
            cache : false,
            timeout : 4000,
            success:  Septima.bind(function(deferred, data, textStatus,  jqXHR){
        		var localDatasources = [];
            	if (data && data.row && data.row[0].row){
            		for (var i=0;i<data.row[0].row.length;i++){
            			localDatasources.push(data.row[0].row[i]._name);
            		}
            		localDatasources.sort(function(t1, t2){
        				return (t1.localeCompare(t2));
        			});
            	}
            	deferred.resolve(localDatasources);
          }, this, deferred)
          });
    	return deferred.promise();
    },

    CLASS_NAME: 'Septima.Search.ThemeSearcher'

});