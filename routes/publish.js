var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var quickGist = require('quick-gist');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var speech_to_text = new SpeechToTextV1 ({
    username: '52e4c979-7f03-4ced-aaa3-eb150f293162',
    password: 'Upyfggg7yBc1'
});

router.post('/', upload.single('audio'), function(req, res) {

    var filepath = './uploads/'+req.file.originalname;

    console.log(filepath);
    fs.rename('./uploads/'+req.file.filename, filepath, function (err) {
        if (err) console.log(err);
        console.log('renamed complete');
    });

    setTimeout(function() {
        var params = {
            audio: fs.createReadStream(filepath),
            content_type: req.file.mimetype,
            timestamps: true,
            word_alternatives_threshold: 0.9,
            speaker_labels: true
        };

        speech_to_text.recognize(params, function(error, transcript) {
            if (error)
                console.log('Error:', error);
            else {
                transcript.filename ='10001-90210-01803.wav' ;
                quickGist({
                    content: JSON.stringify(transcript, null, 2),
                    public: false, // Whether the gist should be public or unlisted. Defaults to false (unlisted).
                    enterpriseOnly: false, // Prohibit posting to GitHub.com. Defaults to false. Useful if you're posting company secrets.
                    fileExtension: 'md' // Optionally force a file extension if you don't want to rely on language-classifier.
                }, function(err, resp, data) {
                    console.log(data);
                    res.send(data.html_url);
                });
            }
        });
    }, 3000);



});

module.exports = router;