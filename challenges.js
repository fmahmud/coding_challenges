var menu = document.getElementById("quick-nav");

function addMenuItem(item) {
	menu.appendChild(item);
}

function createTestCase(input, output) {
	return {
		input : JSON.stringify(input),
		output : JSON.stringify(output)
	};
}

function createAndAddSolutionDiv(number, url, code) {
	var div = document.createElement('div');
	div.id = "c"+number+"-sol";
	div.className = "solution";

	document.getElementById("solutions").appendChild(div);

	var title = document.createElement('div');
	title.className = "solution-title";
	title.innerHTML = "Challenge #"+number+", <a href='"+url+"'>Click here!</a>";
	div.appendChild(title);

	var codeDiv = document.createElement('div');
	codeDiv.className = "solution-code";
	codeDiv.innerHTML = "<pre class='prettyprint'>"+code+"</pre>";
	div.appendChild(codeDiv);

	var testCaseDiv = document.createElement('div');
	testCaseDiv.className = "sln-test-cases";
	div.appendChild(testCaseDiv);

	var outputDiv = document.createElement('pre');
	outputDiv.className = "sln-output prettyprint";
	outputDiv.id = 'sln'+number+'-output';
	// div.appendChild(outputDiv);

	var addTestCaseButton = document.createElement('div');
	addTestCaseButton.className = 'btn-add-test';
	addTestCaseButton.innerHTML = "+";
	div.appendChild(addTestCaseButton);
	return { 
		'wrapper': div,
		'titleDiv': title,
		'codeDiv': codeDiv,
		'testCaseDiv': testCaseDiv,
		'outputDiv': outputDiv,
		'addTestCaseDiv': addTestCaseButton
	};
}

function createMenuItem(number, title) {
	var div = document.createElement('div');
	div.id = "c"+number+"-button";
	div.className = "menu-item";
	div.innerHTML = title;
	return div;
}

function createCodeMirrorTA(parent, _value, _mode) {
	return CodeMirror(parent, {
		value: _value,
		mode: _mode,
		lineNumbers: true,
		lineWrapping: true,
		tabSize: 2,
		indentWithTabs: false,
		theme: "mbo"
	});
}

function createTestCaseDiv(input, expected, got) {
	var wrapper = document.createElement('div');
	wrapper.className = "test-case-div";
	if(expected == got) {
		wrapper.className += " passed";
	} else {
		wrapper.className += " failed"
	}

	var inputDiv = document.createElement('div');
	inputDiv.className = "test-case-input";
	inputDiv.innerHTML = "<div class='test-label'>Input:</div>";
	var inputPre = createCodeMirrorTA(inputDiv, input, "javascript");
	// var inputPre = document.createElement('pre');
	// inputPre.className = "prettyprint";
	// inputPre.innerHTML = input;
	// inputDiv.appendChild(inputPre);
	wrapper.appendChild(inputDiv);

	var expectedDiv = document.createElement('div');
	expectedDiv.className = "test-case-expected";
	expectedDiv.innerHTML = "<div class='test-label'>Expected:</div>";
	var expectedPre = createCodeMirrorTA(expectedDiv, expected, "javascript");
	// var expectedPre = document.createElement('pre');
	// expectedPre.className = "prettyprint";
	// expectedPre.innerHTML = expected;
	// expectedDiv.appendChild(expectedPre);
	wrapper.appendChild(expectedDiv);

	var gotDiv = document.createElement('div');
	gotDiv.className = "test-case-got";
	gotDiv.innerHTML = "<div class='test-label'>Output:</div>";
	var gotPre = createCodeMirrorTA(gotDiv, got, "javascript");
	// var gotPre = document.createElement('pre');
	// gotPre.className = "prettyprint";
	// gotPre.innerHTML = got;
	// gotDiv.appendChild(gotPre);
	setTimeout(function() {
		expectedPre.refresh();
		inputPre.refresh();
		gotPre.refresh();
	}, 1);
	wrapper.appendChild(gotDiv);

	var buttonsDiv = document.createElement('div');
	buttonsDiv.className = "test-case-btns";
	buttonsDiv.innerHTML = "Run";
	wrapper.appendChild(buttonsDiv);

	return { 
		'wrapper'		: wrapper,
		'inputDiv'		: inputDiv,
		'expectedDiv'	: expectedDiv,
		'gotDiv'		: gotDiv,
		'inputPre'		: inputPre,
		'expectedPre'	: expectedPre,
		'gotPre'		: gotPre,
		'buttonsDiv'	: buttonsDiv,
	};
}

function createChallenge(number, solution, cases, url) {
	var toReturn = {};
	toReturn.number = number;
	toReturn.solution = solution;
	toReturn.divs = createAndAddSolutionDiv(number, url, solution.toString());
	toReturn.testCases = [];

	toReturn.scrollTo = function() {
		toReturn.divs.wrapper.scrollIntoView();
	};

	toReturn.addNewTestCase = function(testCase) {
		testCase.divs = createTestCaseDiv(testCase.input, testCase.output, "Not executed yet.");
		testCase.setCase = function(input, expected) {
			testCase.divs.inputPre.innerHTML = JSON.stringify(input);
			testCase.divs.expectedPre.innerHTML = JSON.stringify(expected);
		};
		testCase.run = function() {
			var result = JSON.stringify(solution(JSON.parse(testCase.divs.inputPre.getValue())));
			testCase.divs.gotPre.setValue(result);
			setTimeout(function() {
				gotPre.refresh();
			}, 1);
			if(result == JSON.stringify(JSON.parse(testCase.divs.expectedPre.getValue()))) {
				testCase.divs.wrapper.className = "test-case-div passed";
			} else {
				testCase.divs.wrapper.className = "test-case-div failed";
			}
		};
		testCase.divs.buttonsDiv.addEventListener("click", function() {
			testCase.run();
		});
		toReturn.testCases.push(testCase);
		toReturn.divs.testCaseDiv.appendChild(testCase.divs.wrapper);
	};

	toReturn.runAll = function() {
		for(var i = 0; i < toReturn.testCases.length; ++i) {
			toReturn.testCases[i].run();
		}
	};

	toReturn.log = function(s) {
		toReturn.divs.outputDiv.appendChild = toReturn.divs.outputDiv.innerHTML + "<p>" + s + "</p>";
	};

	//setup menu button
	toReturn.menuButton = createMenuItem(number, "Challenge #"+number);
	toReturn.menuButton.onclick = toReturn.scrollTo;
	addMenuItem(toReturn.menuButton);

	//add all cases.
	for(var i = 0; i < cases.length; ++i) {
		toReturn.addNewTestCase(cases[i]);
	}

	toReturn.divs.addTestCaseDiv.addEventListener('click', function() {
		toReturn.addNewTestCase({input: "", output: "" });
	});

	return toReturn;
}

var challenges = [];

challenges.push(createChallenge("223-1", function(input) {
	var strip = function(word, allowed) {
		var toReturn = "";
		for(var i = 0; i < word.length; ++i) {
			if(allowed.indexOf(word.charAt(i)) > -1) {
				toReturn += word.charAt(i);
			} 
		}
		return toReturn;
	};
	var canContain = function(word, badword) {
		var postStripping = strip(word, badword);
		return postStripping == badword;
	}
	return canContain(input[0], input[1]);
}, (function() {
	var cases = [];
	cases.push(createTestCase(["synchronized", "snond"], true));
	cases.push(createTestCase(["synchronized", "synond"], true));
	cases.push(createTestCase(["synchronized", "sond"], false));
	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/3ddpms/20150715_challenge_223_intermediate_eel_of_fortune/"));

challenges.push(createChallenge("223-2", function(input) {
	for(var i = parseInt(input.length/2); i >= 0; --i) {
		if(input.substring(0, i) == input.substring(input.length - i, input.length)) {
			return i;
		}
	}
	return 0;
}, (function() {
	var cases = [];
	cases.push(createTestCase("onion", 2));
	cases.push(createTestCase("asdfasdf", 4));
	cases.push(createTestCase("asdf", 0));
	cases.push(createTestCase("fasdf", 1));
	cases.push(createTestCase("", 0));
	cases.push(createTestCase("aaaa", 2));

	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/3d4fwj/20150713_challenge_223_easy_garland_words/"));

challenges.push(createChallenge("218-1", function(input) {
	var reverseString = function(s) {
		var o = [];
		var len = s.length;
		for (var i = 0; i <= len; i++) {
			o.push(s.charAt(len - i));
		}
		return o.join("");
	}

	var reverseNum = function(num) {
		return parseInt(reverseString(num+""));
	}

	var isPalindrome = function(s) {
		return s == s.split("").reverse().join("");
	}

	var str = input+"";
	for(var i = 0; ; ++i) {
		if(isPalindrome(str)) {
			return str+", "+i;
		} else {
			var asNum = parseInt(str);
			asNum = asNum + reverseNum(asNum);
			str = asNum + "";
		}
	}
}, (function() {
	var cases = [];
	cases.push(createTestCase(11, "11, 0"));
	cases.push(createTestCase(24, "66, 1"));
	cases.push(createTestCase(123, "444, 1"));
	cases.push(createTestCase(28, "121, 2"));
	cases.push(createTestCase(19, "121, 2"));
	cases.push(createTestCase(286, "8813200023188, 23"));
	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/38yy9s/20150608_challenge_218_easy_making_numbers/"));

challenges.push(createChallenge(217, function(input) {
	var incrementSmallestPile = function() {
		var x = 0;
		var y = 0;
		for(var i = 0; i < input.n; ++i) {
			for(var j = 0; j < input.n; ++j) {
				if(input.piles[i][j] < input.piles[x][y]) {
					x = j, y = i;
				}
			}
		}
		input.piles[y][x]++;
		input.logs--;
	};

	var solve = function() {
		while(input['logs'] > 0) {
			incrementSmallestPile();
		}
		return input.piles;
	};
	return solve();
}, (function() {
	var cases = [];
	cases.push(createTestCase(
		{ 
			n: 3, 
			logs: 7, 
			piles: [[1, 1, 1], [2, 1, 3], [1, 4, 1]]
		}, 
		[[3, 2, 2], [2, 2, 3], [2, 4, 2]]
	));
	cases.push(createTestCase(
		{
			n: 4,
			logs: 199,
			piles: [
				[15,12,13,11],
				[19,14,8,18],
				[13,14,17,15],
				[7,14,20,7]
			]
		},
		[[26,26,26,26],[26,26,26,26],[26,26,26,26],[26,26,26,26]]
	));
	cases.push(createTestCase(
		{ 
			n: 1, 
			logs: 41, 
			piles: [[1]]
		}, 
		[[42]]
	));

	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/3840rp/20150601_challenge_217_easy_lumberjack_pile/"));

challenges.push(createChallenge(220, function(input) {
	var isLetter = function(c) {
		return (c.match(/[a-z]/i));
	};

	var sortWordAndCapitalise = function(s) {
		var lowered = s.toLowerCase().split("").sort();
		if(s.charAt(0) == s.charAt(0).toUpperCase()) {
			lowered[0] = lowered[0].toUpperCase();
		}
		return lowered.join("");
	};

	var toRet = "";
	var wordStart = -1; var wordEnd = -1;
	for(var i = 0; i < input.length; ++i) {
		if(isLetter(input.charAt(i))) {
			if(wordStart < 0) {
				wordStart = i;
			} else {
				if(i == input.length - 1) {
					wordEnd = i;
				}
			}
		} else {
			if(wordStart >= 0) {
				wordEnd = i - 1;
				toRet += sortWordAndCapitalise(input.substring(wordStart, wordEnd + 1));
				wordStart = -1;
				wordEnd = -1;
			}
			toRet += input.charAt(i);
		}
	}
	return toRet;	
}, (function() {
	var cases = [];
	cases.push(createTestCase("This challenge doesn't seem so hard.", "Hist aceeghlln denos't eems os adhr."));
	cases.push(createTestCase("There are more things between heaven and earth, Horatio, than are dreamt of in your philosophy.", 
		"Eehrt aer emor ghinst beeentw aeehnv adn aehrt, Ahioort, ahnt aer ademrt fo in oruy hhilooppsy."));
	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/3aqvjn/20150622_challenge_220_easy_mangling_sentences/"));

challenges.push(createChallenge(222, function(input) {
	var leftWeight = 0; var rightWeight = 0;
	var leftTorque = 0; var rightTorque = 0;
	var leftInd = 0; var rightInd = input.length - 1;
	while(leftInd < rightInd) {
		if(leftTorque <= rightTorque) {
			leftWeight += input.charCodeAt(leftInd) - "A".charCodeAt(0) + 1;
			leftTorque += leftWeight;
			leftInd++;
		} else if(rightTorque < leftTorque) {
			rightWeight += input.charCodeAt(rightInd) - "A".charCodeAt(0) + 1;
			rightTorque += rightWeight;
			rightInd--;
		}
	}
	if(leftTorque == rightTorque && leftInd == rightInd) {
		return input.substring(0, leftInd) + " " + input.charAt(leftInd) + " " + input.substring(rightInd + 1, input.length) + " - " + leftTorque;
	} else {
		return input + " - DOES NOT BALANCE";
	}
}, (function() {
	var cases = [];
	cases.push(createTestCase("CONSUBSTANTIATION", "CONSUBST A NTIATION - 456"));
	cases.push(createTestCase("WRONGHEADED", "WRO N GHEADED - 120"));
	cases.push(createTestCase("UNINTELLIGIBILITY", "UNINTELL I GIBILITY - 521"));
	cases.push(createTestCase("SUPERGLUE", "SUPERGLUE - DOES NOT BALANCE"));
	cases.push(createTestCase("AABAA", "AA B AA - 3"));
	cases.push(createTestCase("STEAD", "S T EAD - 19"));
	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/3c9a9h/20150706_challenge_222_easy_balancing_words/"));

challenges.push(createChallenge("218-2", function(input) {
	var todoList = {
		list: [],
		addItem: function(s) {
			this.list.push(s);
		},
		deleteItem: function(s) {
			var index = this.list.indexOf(s);
			if(index > -1) {
				this.list.splice(index, 1);
			}
		},
		viewList: function() {
			return this.list;
		}
	};

	var output = [];
	for(var i = 0; i < input.length; ++i) {
		if(input[i].indexOf("viewList();") >= 0) {
			var aList = todoList.viewList();
			for(var j = 0; j < aList.length; ++j) {
				output.push(aList[j]);
			}
		} else if(input[i].indexOf("addItem") >= 0) {
			todoList.addItem(input[i].split("'")[1]);
		} else if(input[i].indexOf("deleteItem") >= 0) {
			todoList.deleteItem(input[i].split("'")[1]);
		}
	}
	return output;
}, (function() {
	var cases = [];
	cases.push(createTestCase(
		["addItem('Take a shower');", "addItem('Go to work');", "viewList();", "addItem('Buy a new phone');", "deleteItem('Go to work');", "viewList();"],
		["Take a shower", "Go to work", "Take a shower", "Buy a new phone"]
	));
	return cases;
})(), "https://www.reddit.com/r/dailyprogrammer/comments/39ws1x/20150615_challenge_218_easy_todo_list_part_1/"));

// challenges.push(createChallenge(220, function(input) {
	
// }, (function() {
// 	var cases = [];

// 	return cases;
// })(), ""));

for(var i = 0; i < challenges.length; ++i) {
	challenges[i].runAll();
}

prettyPrint();







