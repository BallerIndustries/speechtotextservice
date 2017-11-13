var request = require('request');
var fs = require('fs');


const dir = '/Users/anguruso/Desktop/to-watson/';
var files = fs.readdirSync(dir);
var url = 'http://localhost:3000/publish';
var filesTranscribed = 0;

for (var i = 0; i < files.length; i++) {
    postFile(dir, files[i], files.length);
}

//postFile('/Users/anguruso/Desktop/to-watson/Actress Stop working with predators.mp3');

function postFile(dir, filename, total) {
    // Build up a request to our beautiful URL.
    var req = request.post(url, function(err, resp, body) {
        filesTranscribed++;

        if (err) {
            console.log('%s/%s Failed to post! err = %s', filesTranscribed, total, err);
            return;
        }

        console.log('%s/%s URL: %s', filesTranscribed, total, body);
    });

    var fileData = fs.createReadStream(dir + filename);

    //
    var form = req.form();
    form.append('audio', fileData, {
        filename: filename,
        contentType: 'audio/mp3'
    });
}


