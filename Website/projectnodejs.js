const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5305;
const session = require('express-session');
const cookieParser = require('cookie-parser');

function validateUsername(username) {
  
    const testing = /^[a-zA-Z0-9]+$/;
    return testing.test(username);
}
  
  
function validatePassword(password) {
   
    const testing = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
    return testing.test(password);
}

app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret', 
    resave: false,    
    saveUninitialized: true 
}));
 
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/catcare', (req, res) => {
    serveHTMLPage('Q8_cat_care', res,req);
});

 
app.get('/contact', (req, res) => {
    serveHTMLPage('Q8_contact', res,req);
});

app.get('/find', (req, res) => {
    serveHTMLPage('Q8_find', res,req);
});

app.get('/dogcare', (req, res) => {
    serveHTMLPage('Q8_dog_care', res,req);
});

app.get('/giveaway', (req, res) => {
    if(req.session.logged_in){
    serveHTMLPage('Q8_give_away', res,req);}
    else {
        res.redirect('/login');}
});

app.post('/giveawayserver', (req, res) => {
    const dogtruth = req.body.dog === "dog";
    const cattruth = req.body.cat === "cat";
    let breedname = "";
    
    if (dogtruth){
        breedname = "dog";
    }
    else if(cattruth){
        breedname = "cat";
    }

    const dogbreed = req.body.dogbreed ;
    const catbreed = req.body.catbreed ;
    const mixbreed = req.body.mixbreed === "mixbreed";
    let breed = "";
    
    if (dogbreed !==""){
        breed = dogbreed;
    }
    else if(catbreed !=="" ){
        breed = catbreed;
    }
    else if(mixbreed){
        breed = "mixbreed";
    }

    let animalage = req.body.animalage;
    let animalgender = "";

    const maletruth = req.body.male ==="male";
    const femaletruth = req.body.female ==="female";

    if (maletruth){
        animalgender = "male";

    }
    else if (femaletruth){
        animalgender = "female";
        
    }
    const getalongdogstruth = req.body.getalongwithdogs;
    const getalongcatstruth = req.body.getalongwithcats;
    let getalongdogs = "" ;
    let getalongcats = "" ;
    if (getalongdogstruth){
        getalongdogs = "get along with dogs";
    }
    else {
        getalongdogs = "don't get along with dogs";
    }
    if (getalongcatstruth){
        getalongcats = "get along with dogs";
    }
    else {
        getalongcats = "don't get along with cats";
    }
    let suitableforchildren = req.body.familycategory;
    if (suitableforchildren ==="yes"){
        suitableforchildren = "suitable for children"
    }
    else if (suitableforchildren ==="no"){
        suitableforchildren = "not suitable for children"
    }

    let comment = req.body.comment;
    let firstname = req.body.firstname;
    let lastname = req.body.familyname;
    let gmail = req.body.email;

    let number = 0;
    
    fs.readFile('pet_info.txt', 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        const lines = data.split('\n');
        const lineCount = lines.length;
        number = lineCount;
        if (lineCount === 0){
            number = 1;
        }
        fs.appendFileSync('pet_info.txt', `${number}:${req.session.username}:${breedname}:${breed}:${animalage}:${animalgender}:${getalongdogs}:${getalongcats}:${suitableforchildren}:${comment}:${firstname}:${lastname}:${gmail}\n`);

    });
   
   
    res.redirect('/giveaway');
 });

 app.post('/findserver', (req, res) => {
    const dogtruth = req.body.dog === "dog";
    const cattruth = req.body.cat === "cat";
    let breedname = "";
    
    if (dogtruth){
        breedname = "dog";
    }
    else if(cattruth){
        breedname = "cat";
    }

    const dogbreed = req.body.dogbreed ;
    const catbreed = req.body.catbreed ;
    const breeddoestmatter = req.body.mixbreed === "mixbreed";
    let breed = "";
    
    if (dogbreed !==""){
        breed = dogbreed;
    }
    else if(catbreed !=="" ){
        breed = catbreed;
    }
    

    let animalage = req.body.animalage;
    let animalgender = "";

    animalgender = req.body.gender_category;
    
    const getalongdogstruth = req.body.getalongwithdogs;
    const getalongcatstruth = req.body.getalongwithcats;
    let getalongdogs = "" ;
    let getalongcats = "" ;
    if (getalongdogstruth){
        getalongdogs = "get along with dogs";
    }
    else {
        getalongdogs = "don't get along with dogs";
    }
    if (getalongcatstruth){
        getalongcats = "get along with cats";
    }
    else {
        getalongcats = "don't get along with cats";
    }
    let suitableforchildren = req.body.age_category;
    if (suitableforchildren ==="yes"){
        suitableforchildren = "suitable for children"
    }
    else if (suitableforchildren ==="no"){
        suitableforchildren = "not suitable for children"
    }


    let data = "";
    const existingAccounts = fs.readFileSync('pet_info.txt', 'utf8').trim().split('\n');
    
    for (let i = 0; i < existingAccounts.length; i++) {
    let correspondingdescription = true;
    const animalexist = existingAccounts[i].split(':');
    
    if(animalgender !== "genderDontMatter" && !breeddoestmatter && animalage !== "Age doesn't matter"){
        if (animalexist[2] === breedname  && animalexist[3] === breed  && animalexist[4] === animalage && animalexist[5] === animalgender && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }

       
    }  else if(animalgender !== "genderDontMatter" && !breeddoestmatter){
        if (animalexist[2] === breedname  && animalexist[3] === breed && animalexist[5] === animalgender && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }}
       else if(animalgender !== "genderDontMatter" && animalage !== "Age doesn't matter"){
            if (animalexist[2] === breedname   && animalexist[4] === animalage && animalexist[5] === animalgender && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
                correspondingdescription = true;
            }
            else{
                correspondingdescription = false;
            }}
        else if(animalage !== "Age doesn't matter" && !breeddoestmatter){
                if (animalexist[2] === breedname  && animalexist[3] === breed  && animalexist[4] === animalage && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
                    correspondingdescription = true;
                }
                else{
                    correspondingdescription = false;
                }
         } else if(animalgender !== "genderDontMatter"){
        if (animalexist[2] === breedname  && animalexist[5] === animalgender && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }

       
    } else if(!breeddoestmatter){
        
        if (animalexist[2] === breedname  && animalexist[3] === breed   && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }

    } else if (animalage !== "Age doesn't matter"){
        
        if (animalexist[2] === breedname  &&  animalexist[4] === animalage  && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }
    }else{
        if (animalexist[2] === breedname && animalexist[6] === getalongdogs && animalexist[7] === getalongcats && animalexist[8] === suitableforchildren){
            correspondingdescription = true;
        }
        else{
            correspondingdescription = false;
        }

    }

    

    if (correspondingdescription){
       data += 'animal type => '+ animalexist[2]+': animal breed =>'+animalexist[3] +': animal age =>'+animalexist[4] +': animal gender => '+animalexist[5] +':'+animalexist[6] +':'+animalexist[7] +':'+animalexist[8] +': comment => '+animalexist[9] +': first name of owner => '+animalexist[10] +': last name of owner => '+animalexist[11]+': gmail of owner => '+animalexist[12]+'<br>';
    }

    if ( i === (existingAccounts.length-1)) {
        if (data=== ""){
            res.send('<p>no data found</p></br><a href="/giveaway" class="active">Click on this to go back to the previous page</a>');
        }

        else{
        res.send('<p>' + data + '</p> </br><a href="/giveaway" class="active">Click on this to go back to the previous page</a>');}
        
    }}

 });

app.post('/loginverification', (req, res) => {
   
    const username = req.body.username;
    const password = req.body.password;

    if (!validateUsername(username) || !validatePassword(password)) {
        return;
    }
     
    let loginsuccesfull = false;
    const existingAccounts = fs.readFileSync('login.txt', 'utf8').trim().split('\n');
    for (let i = 0; i < existingAccounts.length; i++) {
    const existingUsername = existingAccounts[i].split(':')[0];
    const existingPassword = existingAccounts[i].split(':')[1];
    if (existingUsername === username && existingPassword === password) {
        loginsuccesfull = true;
        req.session.logged_in = true;
        req.session.username = username;
        res.redirect('/giveaway');
        
    }}

    if (!loginsuccesfull){
        res.send('<p>Login Failed.</p></br><a href="/login" class="active">Click on this to go back to the previous page</a>');
        
    }
});

app.get('/home', (req, res) => {
    serveHTMLPage('Q8_home', res,req);
});

app.get('/login', (req, res) => {
    serveHTMLPage('login', res,req);
});

app.get('/next', (req, res) => {
    res.sendFile(__dirname+'/home');
});

app.get('/createaccount', (req, res) => {
    if (!req.session.logged_in){
    serveHTMLPage('create_account', res,req);}
    
});

app.get('/disclaimer', (req, res) => {
    const filePath = path.join(__dirname,`Q8_disclaimer.html`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send(data); 
    });
    
});

app.post('/logout', (req, res) => {
    req.session.logged_in = false;
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error destroying session');
        } else {
            
            res.send('<p>You have logged out</p></br><a href="/login" class="active">Click on this to go back to the previous page</a>');
        }
    });
});


app.post('/accountcreation', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    

    if (!validateUsername(username) || !validatePassword(password)) {
        return;
    }
     
    let usernameexist = false;
    const existingAccounts = fs.readFileSync('login.txt', 'utf8').trim().split('\n');
    for (let i = 0; i < existingAccounts.length; i++) {
    const existingUsername = existingAccounts[i].split(':')[0];
    if (existingUsername === username) {
        res.send('<p>Username is already in use. Please choose a different username.</p></br><a href="/createaccount" class="active">Click on this to go back to the previous page</a>');
        usernameexist = true;
        return;
    }}

    if (validateUsername(username) && validatePassword(password) && !usernameexist ){
      fs.appendFileSync('login.txt', `${username}:${password}\n`);
      //res.redirect('/createaccount');
      res.send('<p>Account creation successful.You are ready to log in.</p></br><a href="/createaccount" class="active">Click on this to go back to the previous page</a>');
    }

   
});



function serveHTMLPage(htmlname, res, req) {
    const filePath = path.join(__dirname,`${htmlname}.html`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        const modifiedHTML = data.replace(/<header><\/header>/g, `<header><h1 class="header">Dogs &amp; Cats Adoption Center  <span id="current-time"></span><a href="/home"> <!-- Borrowed the image from an AI-Image generator (created my own logo) online named "deepdreamgenerator" --><!--https://deepdreamgenerator.com/processing/3789769?ut=OimTfIt8NGc5--> &nbsp; <img src="pet-logo.jpg" alt="pet_logo" class="pet_image" width="93" height="100">  </a></h1></header>`)
        if (req.session.logged_in){
            const modifiedHTML2 = modifiedHTML.replace(/<footer><\/footer>/g, `<footer>You are logged in as '${req.session.username}'. Please view the privacy notice:<a href="/disclaimer" style="color:black;">Privacy/Disclaimer Statement</a> <form action="/logout" method="post"><button type="submit">Logout</button></form></footer>`);
            res.send(modifiedHTML2);
        }else{
            const modifiedHTML2 = modifiedHTML.replace(/<footer><\/footer>/g, `<footer><a href="/disclaimer" style="color:black;">Privacy/Disclaimer Statement</a></footer>`);
            res.send(modifiedHTML2);}
        

       return;
        
    });
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

