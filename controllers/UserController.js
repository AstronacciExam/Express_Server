const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const UserController = {
  LoginUser: async (req, res) => {
    try{
      const params = req.body;
      
      const filePath = path.join(process.cwd(), 'database', 'user.json');
      const dataJson = fs.readFileSync(filePath, 'utf8');
      const dataUser = JSON.parse(dataJson);

      const findData = dataUser.find(x => x.email === params.email);
      if(!findData) return res.status(404).json({
        status: 101,
        message: 'Data user tidak ditemukan!'
      });

      if(findData.login_platform != 'system') return res.status(500).json({
        status: 101,
        message: `Data user terdaftar menggunakan ${findData.login_platform}!`
      });

      const matchPass = await bcrypt.compare(params.password, findData.password);
      if(!matchPass) return res.status(400).json({ status: 101, message: 'Kata sandi tidak sesuai!' });

      const filePathRole = path.join(process.cwd(), 'database', 'role.json');
      const dataJsonRole = fs.readFileSync(filePathRole, 'utf8');
      const dataRole = JSON.parse(dataJsonRole);

      const findRole = dataRole.find(x => x.slug == findData.role_code);
      const { email, fullname } = findData;
      const result = {
        status: "Success",
        data: { email, fullname, roles: findRole }
      };
      res.status(200).json(result);
    }catch(e){
      res.status(500).json({ error: e.message });
    }
  },

  RegisterUser: async (req, res) => {
    try {
      const params = req.body;
      
      const filePath = path.join(process.cwd(), 'database', 'user.json');
      const dataJson = fs.readFileSync(filePath, 'utf8');
      const dataUser = JSON.parse(dataJson);

      const findData = dataUser.find(x => x.email === params.email);
      if(findData) { 
        return res.status(500).json({
          status: 101,
          message: 'Data user sudah terdaftar!'
        });
      };

      const hashedPassword = await bcrypt.hash(params.password, 10);
      const obj = {
        role_code: "a",
        email: params.email,
        password: hashedPassword,
        fullname: params.fullname,
        login_platform: "system"
      };
      
      dataUser.push(obj);
      fs.writeFileSync(filePath, JSON.stringify(dataUser, null, 2), 'utf8');
      
      const filePathRole = path.join(process.cwd(), 'database', 'role.json');
      const dataJsonRole = fs.readFileSync(filePathRole, 'utf8');
      const dataRole = JSON.parse(dataJsonRole);
      const findRole = dataRole.find(x => x.slug == obj.role_code);

      const result = {
        status: 'Success',
        message: 'User baru telah berhasil ditambahkan',
        data: {
          email: obj.email,
          fullname: obj.fullname,
          roles: findRole
        }
      }
      res.status(200).json(result);
    }catch(e){
      res.status(500).json({ error: e.message });
    }
  },

  LoginSocialMedia: async (req, res) => {
    try {
      const params = req.body;
      
      const filePath = path.join(process.cwd(), 'database', 'user.json');
      const dataJson = fs.readFileSync(filePath, 'utf8');
      const dataUser = JSON.parse(dataJson);

      const filePathRole = path.join(process.cwd(), 'database', 'role.json');
      const dataJsonRole = fs.readFileSync(filePathRole, 'utf8');
      const dataRole = JSON.parse(dataJsonRole);

      const findData = dataUser.find(x => x.email === params.email);
      if(!findData) {
        const obj = {
          role_code: "a",
          email: params.email,
          password: null,
          fullname: params.fullname,
          login_platform: params.login_platform
        };
        
        dataUser.push(obj);
        fs.writeFileSync(filePath, JSON.stringify(dataUser, null, 2), 'utf8');
        
        const findRole = dataRole.find(x => x.slug == obj.role_code);
        const result = {
          status: "Success",
          data: {
            email: obj.email,
            fullname: obj.fullname,
            roles: findRole
          }
        };

        return res.status(200).json(result);
      }

      if(findData.login_platform != params.login_platform) return res.status(500).json({
        status: 101,
        message: `${findData.email} telah terdaftar!`
      });

      const findRole = dataRole.find(x => x.slug == findData.role_code);
      const { email, fullname } = findData;
      const result = {
        status: "Success",
        data: { email, fullname, roles: findRole }
      };

      res.status(200).json(result);
    }catch(e){
      res.status(500).json({ error: e.message });
    }
  },
}

module.exports = UserController;