module.exports = {
  async afterCreate(event)  {
    const { result } = event;

    function getStaffId(seq, year = '00', program = 'RAFTEL') {
      let getZero = '';
      for (let i = 0; i < 5 - seq.toString().length; i += 1) {
        getZero += '0';
      }
      return year + program + getZero + seq;
    }

    const firstName = result.firstName.split('-')[0].toLowerCase();
    const lastName = result.lastName.toLowerCase();
    const email = `${firstName}.${lastName}@raftel.io`;
    const emailAlt = `${firstName}.${lastName}${result.id}@raftel.io`;

    const oldUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email:email },
    });

    if(oldUser) {
      try {
        await strapi.plugins['users-permissions'].services.user.add({
          blocked: false,
          confirmed: true,
          firstName: result.firstName,
          lastName: result.lastName,
          username: getStaffId(result.id),
          email: emailAlt,
          password: 'faculty2022', //will be hashed automatically
          provider: 'local', //provider
          created_by: 1, //user admin id
          updated_by: 1, //user admin id
          role: 3 //role id
        }).then(async (res)=>{
          await strapi.db.query('api::faculty.faculty').update({
            where: { id: result.id },
            data: {
              email: res.email,
              uid: getStaffId(result.id),
            }
          });
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { email:email },
            data: {
              avatar: { ...result.avatar }
            }
          });
        });
      } catch (e) {
        console.log(e.errors)
      }
    }

    try {
      await strapi.plugins['users-permissions'].services.user.add({
        blocked: false,
        confirmed: true,
        firstName: result.firstName,
        lastName: result.lastName,
        username: getStaffId(result.id),
        email: email,
        password: 'faculty2022', //will be hashed automatically
        provider: 'local', //provider
        created_by: 1, //user admin id
        updated_by: 1, //user admin id
        role: 3 //role id
      }).then(async (res)=>{
        await strapi.db.query('api::faculty.faculty').update({
          where: { id: result.id },
          data: {
            email: res.email,
            uid: getStaffId(result.id),
          }
        });

        await strapi.db.query('plugin::users-permissions.user').update({
          where: { email:email },
          data: {
            avatar: { ...result.avatar }
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
};
