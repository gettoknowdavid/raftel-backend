module.exports = {
  async afterCreate(event)  {
    const { result } = event;

    const firstName = result.firstName.split('-')[0].toLowerCase();
    const lastName = result.lastName.toString().toLowerCase();
    const email = `${firstName}.${lastName}@stu.raftel.io`;
    const emailAlt = `${firstName}.${lastName}${result.id}@stu.raftel.io`;
    const password = 'student2022?';

    function getStudentId(seq, year = '01', program = 'ECN') {
      let getZero = '';
      for (let i = 0; i < 5 - seq.toString().length; i += 1) {
        getZero += '0';
      }
      return year + program + getZero + seq;
    }

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
          username: getStudentId(result.id),
          email: emailAlt,
          password: password, //will be hashed automatically
          provider: 'local', //provider
          created_by: 1, //user admin id
          updated_by: 1, //user admin id
          role: 4 //role id
        }).then(async (res)=>{
          await strapi.db.query('api::student.student').update({
            where: { id: result.id },
            data: {
              email: res.email,
              uid: getStudentId(result.id),
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
        username: getStudentId(result.id),
        email: email,
        password: password, //will be hashed automatically
        provider: 'local', //provider
        created_by: 1, //user admin id
        updated_by: 1, //user admin id
        role: 4 //role id
      }).then(async (res)=>{
        await strapi.db.query('api::student.student').update({
          where: { id: result.id },
          data: {
            email: res.email,
            uid: getStudentId(result.id),
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
