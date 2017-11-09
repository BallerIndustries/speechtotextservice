var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var speech_to_text = new SpeechToTextV1 ({
    username: '52e4c979-7f03-4ced-aaa3-eb150f293162',
    password: 'Upyfggg7yBc1'
});

var params = {
    audio: fs.createReadStream(files[file]),
    content_type: 'audio/mpeg',
    timestamps: true,
    word_alternatives_threshold: 0.9,
    keywords: ['colorado', 'tornado', 'tornadoes'],
    keywords_threshold: 0.5
};

speech_to_text.recognize(params, function(error, transcript) {
    if (error)
        console.log('Error:', error);
    else
        console.log(JSON.stringify(transcript, null, 2));
});