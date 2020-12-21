const nodemailer =  require('nodemailer');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            fullname: req.fullname,
            phone : req.phone,
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/trangchu');
    });

    // TrangChu ===========================
    app.get('/trangchu', function(req, res) {
        res.render('Home.ejs');
    });

    // Trang Nguoi Dung======================
    app.get('/nguoidung',isLoggedIn,function(req,res){
        res.render('UserPage.ejs',{user : req.user});
    });

    // TheDienThoai =======================
    app.get('/thedienthoai', function(req, res) {
        res.render('Thedienthoai.ejs');
    });
    app.get('/muathedienthoai',isLoggedIn, function(req,res){
        res.render('Userphonecard.ejs',{user : req.user,  mess: req.flash('mess')});
    });

    // TheGame ===========================
    app.get('/thegame', function(req, res) {
        res.render('Thegame.ejs');
    });
    app.get('/muathegame',isLoggedIn,function(req,res){
        res.render('Usergamecard.ejs',{user : req.user});
    })

    // Tien Dien Thoai ====================
    app.get('/tiendienthoai',function(req,res){
        res.render('tiendienthoai.ejs');
    })
    app.get('/naptiendienthoai',isLoggedIn,function(req,res){
        res.render('Userphonemoney.ejs',{user : req.user})
    })
    // Admin =========================
    app.get('/Admin',function(req,res){
        res.render('Admin.ejs');
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/nguoidung', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/nguoidung', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
//route gmail
    app.post('/send-mail', function(req, res) {
        //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
        var transporter =  nodemailer.createTransport({ // config mail server
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'tthanhtoanonline@gmail.com', //Tài khoản gmail vừa tạo
                pass: 'Nam08846475' //Mật khẩu tài khoản gmail vừa tạo
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });
        var content = '';
        content += `
            <div style="padding: 10px; background-color: #003375">
                <div style="padding: 10px; background-color: white;">
                    <h4 style="color: #0085ff">CHÚC MỪNG BẠN ĐÃ GIAO DỊCH THÀNH CÔNG</h4>
                    <span style="color: black">Đây là mã thẻ : "I love u"</span>
                </div>
            </div>
        `;
        var mainOptions = { 
            from: 'NQH-Test nodemailer',
            to: req.body.mail,
            subject: 'Test Nodemailer',
            text: 'Your text is here',
            html: content 
        }
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
                req.flash('mess', 'Lỗi gửi mail: '+err); 
                res.redirect('/nguoidung');
            } else {
                console.log('Message sent: ' +  info.response);
                req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); 
                res.redirect('/nguoidung');
            }
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/trangchu');
}



//route gamil 
