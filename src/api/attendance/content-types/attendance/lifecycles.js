module.exports = {
  async afterUpdate(event) {
    const { id, open, timer } = event.result;

    // Change set timer from seconds to milliseconds
    const milliseconds = timer * 1000;

    // Check if the attendance is open
    if (open === true) {

      // If the attendance is open, set a timer to close it
      setTimeout(async ()=> {
        await strapi.db.query('api::attendance.attendance').update({
          where: { id: id },
          data: { open: false }
        });
      }, milliseconds);
    }
  }
}
