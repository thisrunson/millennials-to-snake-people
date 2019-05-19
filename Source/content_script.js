//modification of "millennials to snake people" to replace web instances of "in polls" with "among old white people with landline phones"

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    //Clean up a couple instances to reduce variability on matches
    v = v.replace(/\bOpinion poll(s)?\b/g, "Poll$1");
    v = v.replace(/\bopinion poll(s)?\b/g, "poll$1");

    //Polls w/ and w/out caps, because I don't know how to get that fancy w/ regexes
    v = v.replace(/\bPoll(s)?([.,\/#!$%\^&\*;:{}=\-_`~()]\s)\b/g, "Phone calls with unmelanated fogeys$2");
    v = v.replace(/\bpoll(s)?([.,\/#!$%\^&\*;:{}=\-_`~()]\s)?\b/g, "survey$1 of unmelanated fogeys$2");
 
    //Match various instances of "polls," "polling," "surveying," etc.
    v = v.replace(/\b(the)? poll(s|ing)?\b/g, " chatty-chat$2 with the landlined gentry");
    v = v.replace(/\b(the)? polling?\b/g, " sliding into some old white's landline DMs ;) ");
    v = v.replace(/\b(A|The|the) poll(s)?\b/g, "$1 opinion of old white people with landline phones");
    v = v.replace(/\b(T|t)(he)? pollster(ss)\b/g, "$1hose who adore calling old white people with landline phones");
    v = v.replace(/\b(Survey|Poll)(s|ing)?\b/g, "Chatty-chat$2 with the landlined gentry");
    v = v.replace(/\b(Survey|Poll) (numbers|results|scores)?\b/g, "Calls to old white people with landline phones");

    //Don't forget pollsters! They need <3 too
    v = v.replace(/\bPollster(s)?\b/g, "People who slide into landline DMs");
    v = v.replace(/\bpollster(s)?\b/g, "people who slide into landline DMs");
    v = v.replace(/\b(S|s)urvey research\b/g, "$1lidin' into landline 'DMs', as it were");   


    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
  
//Texts for testing
//var body_text = "<p>Match me please</p><p>Take me to the In Mat</p><p>What do the polls say?</p><p>Let's please listen to the polls</p><p>Bernie Sanders is up in polling</p><p>Trump is up in the polls</p><p>Polls say that snakes...</p><p>In polls, Clinton....</p><p>In polling, Hillary leads....</p><p>Polling has Hillary far ahead....</p><p>The poll dictates</p><p>The pole dictates</p><p>Pollsters want blood</p><p>The pollsters want blood</p><p>Here come the pollsters</p><p>There was a recent polling spike</p><p>There was a recent spike in the polls</p><p>A sudden drop in the polls</p><p>Polls dropped Wednesday</p><p>The pollsters find that</p><p>The pollsters feel that</p><p>Jimmy is up in the polls</p><p>Survey results show that</p><p>Biden is up in surveys</p><p>Surveys show that</p><p>Biden saw a big spike in polls</p><p>Biden saw a big boost in the polls</p><p>Polls spiked for Biden Wednesday</p><p>Biden saw a jump in polling</p><p>Biden saw a drop in polls</p><p>Biden's polling numbers fell</p><p>Biden's poll numbers fell</p><p>Biden's poll numbers dipped</p><p>Biden's polling numbers spiked</p><p>The poll numbers for Clinton are at an all time high</p>";
//var body_text = "<p>NEW</p><p>Polling among students says that....</p><p>New poll results show....</p><p>New polls results have Biden</p><p>Biden's rating CRASHED with the latest polls</p>";
//var body_text = "<p>ACTUAL HEADLINES</p><p>Poll: Sanders support among young voters drops sharply</p><p>Tim Graham, Brad Wilmouth: MSNBC’s Chuck Todd only cites polls suggesting public support for abortion</p><p>Then Todd jumped in with polling results:Let me put it on the screen here. From the midterm, we have a few different ways I want to put it up here.He then showed an NBC News exit poll from November 2018 finding that 66 percent indicated they wish to keep the Roe v. Wade decision, and only 25 percent picked “overturn it.”</p><p>Could that poll be skewed? PRRI is run by a man named Robert Jones, whose latest book is delighting the left by predicting “The End of White Christian America” (hailed in blurbs by Joy Reid, Joan Walsh, and Michael Eric Dyson.)</p><p>“One thing I always think about this issue, when we talk about the politics of it, is the polling on this is very hard to pin down. I was looking before the show. I could find a poll, if you're on the pro-choice side, you could point to and say, 'Hey, America is with me.' I can find a poll if you're on the pro-life side, you could do the exact same thing with.” There are “conflicting attitudes.”</p><p>Biden expands lead over rivals for 2020 U.S. presidential nomination despite lack of support from millennials: Reuters/Ipsos poll</p><p>NEW YORK (Reuters) - Former U.S. Vice President Joe Biden has expanded his lead over a wide field of candidates for the 2020 Democratic presidential nomination by 5 percentage points since he entered the race in late April, according to a monthly Reuters/Ipsos poll.</p><p>The poll released on Wednesday found 29% of Democrats and independents said they would vote for Biden in the state nominating contests that begin next year. That is up from 24% who said so in a poll that ran in late April, days before Biden announced his bid.</p><p>Modi faces unlikely challenge as Indian polling draws to an end</p><p>A polling place[1] is where voters cast their ballots in elections.The phrase polling station is also used in American English[1] and in British English,[2] although polling place is the building[3] and polling station is the specific room[3] (or part of a room) where voters cast their votes. A polling place can contain one or more polling stations.[3] Since elections generally take place over a one- or two-day span on a periodic basis, often annual or longer, polling places are usually located in facilities used for other purposes, such as schools, churches, sports halls, local government offices, or even private homes, and may each serve a similar number of people. The area may be known as a ward, precinct, polling district or constituency. The polling place is staffed by officials (who may be called election judges, returning officers or other titles) who monitor the voting procedures and assist voters with the election process. Scrutineers (or poll-watchers) are independent or partisan observers who attend the poll to ensure the impartiality of the process.</p><p>Democratic presidential candidate Joe Biden visits a coffee shop on May 14 in Concord, New Hampshire. The former vice president has led in every national poll so far.</p>";
//var body_text = "<p>ACTUAL HEADLINES</p><p>Poll: Sanders support among young voters drops sharply</p><p>Tim Graham, Brad Wilmouth: MSNBC’s Chuck Todd only cites polls suggesting public support for abortion</p><p>Then Todd jumped in with polling results:Let me put it on the screen here. From the midterm, we have a few different ways I want to put it up here.He then showed an NBC News exit poll from November 2018 finding that 66 percent indicated they wish to keep the Roe v. Wade decision, and only 25 percent picked “overturn it.”</p><p>Could that poll be skewed? PRRI is run by a man named Robert Jones, whose latest book is delighting the left by predicting “The End of White Christian America” (hailed in blurbs by Joy Reid, Joan Walsh, and Michael Eric Dyson.)</p><p>“One thing I always think about this issue, when we talk about the politics of it, is the polling on this is very hard to pin down. I was looking before the show. I could find a poll, if you're on the pro-choice side, you could point to and say, 'Hey, America is with me.' I can find a poll if you're on the pro-life side, you could do the exact same thing with.” There are “conflicting attitudes.”</p><p>Biden expands lead over rivals for 2020 U.S. presidential nomination despite lack of support from millennials: Reuters/Ipsos poll</p><p>NEW YORK (Reuters) - Former U.S. Vice President Joe Biden has expanded his lead over a wide field of candidates for the 2020 Democratic presidential nomination by 5 percentage points since he entered the race in late April, according to a monthly Reuters/Ipsos poll.</p><p>The poll released on Wednesday found 29% of Democrats and independents said they would vote for Biden in the state nominating contests that begin next year. That is up from 24% who said so in a poll that ran in late April, days before Biden announced his bid.</p><p>Modi faces unlikely challenge as Indian polling draws to an end</p><p>A polling place[1] is where voters cast their ballots in elections.The phrase polling station is also used in American English[1] and in British English,[2] although polling place is the building[3] and polling station is the specific room[3] (or part of a room) where voters cast their votes. A polling place can contain one or more polling stations.[3] Since elections generally take place over a one- or two-day span on a periodic basis, often annual or longer, polling places are usually located in facilities used for other purposes, such as schools, churches, sports halls, local government offices, or even private homes, and may each serve a similar number of people. The area may be known as a ward, precinct, polling district or constituency. The polling place is staffed by officials (who may be called election judges, returning officers or other titles) who monitor the voting procedures and assist voters with the election process. Scrutineers (or poll-watchers) are independent or partisan observers who attend the poll to ensure the impartiality of the process.</p><p>Democratic presidential candidate Joe Biden visits a coffee shop on May 14 in Concord, New Hampshire. The former vice president has led in every national poll so far.</p><p>There was no need. According to the most recent poll in the state, Biden already has a commanding lead there.</p><p>As for the polls, NBC News had Joe Biden at 30%, Bernie Sanders at 23%, and Beto O’Rourke and Kamala Harris at about 8% each. Cory, until this year a national celebrity, was at 3.5%.</p><p>And they have punished him in the polls as a result.</p><p>Opinion polls haven’t done too well in some important recent elections.</p><p>Polls failed to foresee the Brexit decision, and suggested Hillary Clinton would be elected president of the United States in 2016. There’s good reason to think polls now have a harder time predicting election outcomes than in the past.</p><p>For instance, if you are polling Australian voters and get a lot of 65-year-old self-funded retirees in your sample, you are going to overweight the Liberal Party vote. Get a lot of 20-year-old university students in your sample and the poll will tell you the Greens are set to become Australia’s largest political party.</p><p>What pollsters do in response is weight the answers they do get. They know they’re getting a lot of older folks, for example, so they weight the responses of younger respondents to try to even things out.</p><p>It turns out these markets are really pretty good predictors on average. A security that trades at 70 cents pays out about 70% of the time on average. There is what financial economists call “excess volatility”, but if you want the best predictor of an election outcome, look at the markets, not the polls.</p><p>The modern public-opinion poll has been around since the Great Depression, when the response rate—the number of people who take a survey as a percentage of those who were asked—was more than ninety. The participation rate—the number of people who take a survey as a percentage of the population—is far lower. Election pollsters sample only a minuscule portion of the electorate, not uncommonly something on the order of a couple of thousand people out of the more than two hundred million Americans who are eligible to vote. The promise of this work is that the sample is exquisitely representative. But the lower the response rate the harder and more expensive it becomes to realize that promise, which requires both calling many more people and trying to correct for “non-response bias” by giving greater weight to the answers of people from demographic groups that are less likely to respond. Pollster.com’s Mark Blumenthal has recalled how, in the nineteen-eighties, when the response rate at the firm where he was working had fallen to about sixty per cent, people in his office said, “What will happen when it’s only twenty? We won’t be able to be in business!” A typical response rate is now in the single digits.</p><p>Meanwhile, polls are wielding greater influence over American elections than ever. In May, Fox News announced that, in order to participate in its first prime-time debate, hosted jointly with Facebook, Republican candidates had to “place in the top ten of an average of the five most recent national polls.” Where the candidates stood on the debate stage would also be determined by their polling numbers. (Ranking in the polls had earlier been used to exclude third-party candidates.) Scott Keeter, Pew’s director of survey research, is among the many public-opinion experts who found Fox News’s decision insupportable. “I just don’t think polling is really up to the task of deciding the field for the headliner debate,” Keeter told me. Bill McInturff doesn’t think so, either. McInturff is a co-founder of Public Opinion Strategies, the leading Republican polling organization; with its Democratic counterpart, Hart Research Associates, he conducts the NBC News/Wall Street Journal poll. “I didn’t think my job was to design polling so that Fox could pick people for a debate,” McInturff told me. Really, it’s not possible to design a poll to do that.</p><p>The senator from Massachusetts had a slow start in the Democratic presidential race, struggling with lackluster fund-raising and middling polls in the first few months of her campaign while watching rivals such as Beto O’Rourke and Pete Buttigieg each take a moment in the sun with bursts of support and surging contributions.</p><p>But now, there are early signs Warren’s relentless focus on policy detail and diligent face time with voters may be leading to a boost of her own, one that could help her break into the top tier of candidates that has been dominated by white men in early polls.</p>";
//document.write(body_text);

walkAndObserve(document);
