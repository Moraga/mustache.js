/**
 * Mustache parser
 * @param DOMElement element
 * @param object context Template variables
 */
function mustache(element, context, index) {
	// text node
	if (element.nodeType == 3) {
		var cond = element.nodeValue.match(mustache.cd);
		// conditional
		if (cond) {
			// new or closing conditional
			if (!index || (cond[1] == '/' &&  cond[2] == index)) {
				element.nodeValue = '';
				return cond.slice(1);
			}
		}
		// variables
		else {
			element.nodeValue = element.nodeValue.replace(mustache.vr, function(m, name) {
				return name == '.' ? context : context[name];
			});
		}
	}
	// tag node
	else if (!index) {
		for (var i=0, sub; i < element.childNodes.length; i++) {
			if (element.childNodes[i].nodeType != 8 && element.childNodes[i].nodeName != 'SCRIPT') {
				sub = mustache(element.childNodes[i], context, index);
				// conditional
				if (sub) {
					// open
					if (sub[0] == '#') {
						var ret = [], cln = [];
						index = sub[1];
					}
					// close
					else {
						// each context value
						for (var j=0, k, base=[], tgt; j < context[index].length; j++) {
							// each element retrieved
							for (k=0; k < ret.length; k++) {
								// first interaction
								if (!j) {
									tgt = ret[k];
									base.push(tgt.cloneNode(true));
								}
								else {
									tgt = base[k].cloneNode(true);
									ret[0].parentNode.appendChild(tgt);
								}
								mustache(tgt, context[index][j]);
							}
						}
					}
				}
				else if (index) {
					ret.push(element.childNodes[i]);
				}
			}
		}
	}
}

mustache.vr = /{{([^}]+)}}/g;
mustache.cd = /{{([#\/])([^}]+)}}/;