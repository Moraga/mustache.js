/**
 * Mustache parser
 * @param string txt Input text
 * @param array data Data as array
 */
function mustache(txt, data) {
	var stw = '{{',
		enw = '}}',
		cur = 0,
		prs = false,
		ret = '',
		mke = '',
		rtv = '',
		rtt = '',
		tmp = '',
		stk = 0,
		mke,
		ope,
		ctx,
		sub,
		val,
		prv;
	
	for (var c='', i=0; i < txt.length; i++) {
		c = txt.charAt(i);
		if (prs) {
			if (c == enw[cur]) {
				cur++;
				if (cur == enw.length) {
					// variable and operator
					if (['#', '^', '/'].indexOf(mke.charAt(0)) > -1) {
						ope = mke.charAt(0);
						mke = mke.substr(1);
					}
					else {
						ope = '';
					}
					
					val = '';
					// search value in multiples context
					for (ctx in data) {
						if (data[ctx].constructor == Object && mke in data[ctx]) {
							val = data[ctx][mke];
							break;
						}
					}
					
					// conditional dependent
					if (rtv) {
						// closing previous operation
						if (ope == '/' && mke == rtv && stk == 1) {
							if (prv == '#' && val) {
								if (val.constructor == Array) {
									for (sub in val) {
										ret += mustache(rtt, [val[sub]].concat(data));
									}
								}
								else {
									ret += mustache(rtt, [val].concat(data));
								}
							}
							else if (prv == '^' && !val) {
								ret += mustache(rtt, data);
							}
							rtv = '';
							rtt = '';
							stk = 0;
						}
						// new operation
						else {
							if (mke == rtv) {
								if (ope == '#') {
									stk++;
								}
								else if (ope == '/') {
									stk--;
								}
							}
							rtt += stw + ope + mke + enw;
						}
					}
					else {
						if (ope) {
							prv = ope;
							rtv = mke;
							stk++;
						}
						else {
							if (mke == '.') {
								ret += data[0];
							}
							else {
								ret += val;
							}
						}
					}
					prs = false;
					cur = 0;
					mke = '';
				}
				continue;
			}
			else {
				cur = 0;
			}
			
			// skipped characteres
			if (c == '\t' || c == ' ')
				continue;
			
			mke += c;
		}
		else {
			if (c == stw.charAt(cur)) {
				cur++;
				if (cur == stw.length) {
					prs = true;
					cur = 0;
					tmp = '';
					continue;
				}
				else {
					tmp += c;
				}
			}
			else {
				if (tmp) {
					c = tmp + c;
					tmp = '';
				}
				cur = 0;
				if (rtv) {
					rtt += c;
				}
				else {
					ret += c;
				}
			}
		}
	}
	
	return ret;
}