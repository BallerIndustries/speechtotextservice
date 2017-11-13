var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var quickGist = require('quick-gist');
// var shorturl = require('shorturl');
var TinyURL = require('tinyurl');
// var short_url = require('short-url');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var speech_to_text = new SpeechToTextV1 ({
    username: '52e4c979-7f03-4ced-aaa3-eb150f293162',
    password: 'Upyfggg7yBc1'
});

router.post('/', upload.single('audio'), function(request, response) {

    var filepath = './uploads/'+request.file.originalname;

    console.log(filepath);
    fs.rename('./uploads/'+request.file.filename, filepath, function (err) {
        if (err) {
            console.log(err);
            return response.status(500).send(err);
        }

        console.log('renamed complete');


        var params = {
            audio: fs.createReadStream(filepath),
            content_type: request.file.mimetype,
            timestamps: true,
            word_alternatives_threshold: 0.9,
            speaker_labels: true
        };

        speech_to_text.recognize(params, function(error, transcript) {
            if (error)
                return response.status(500).send(err);

            console.log('Successfully transcribed by Watson');

            transcript.filename ='10001-90210-01803.wav' ;
            quickGist({
                content: JSON.stringify(transcript, null, 2),
                public: false, // Whether the gist should be public or unlisted. Defaults to false (unlisted).
                enterpriseOnly: false, // Prohibit posting to GitHub.com. Defaults to false. Useful if you're posting company secrets.
                fileExtension: 'md' // Optionally force a file extension if you don't want to rely on language-classifier.
            }, function(err, _, data) {
                if(err) {
                    return response.status(500).send(err);
                }

                console.log('Successfully put onto Github');

                var url = data.files['gist1.md'].raw_url;
                console.log('url = ' + url);
                TinyURL.shorten(url, function (result) {
                    if (result === '') {
                        return response.status(500).send('Failed to shorten URL');
                    }

                    console.log('result = ' + result);
                    response.status(200).send(result);
                });

            });
        });
    });
});

module.exports = router;
