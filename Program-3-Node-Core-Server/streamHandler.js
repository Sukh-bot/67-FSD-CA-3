/**
 * Stream Handlers for Export & Log Auditing
 * Demonstrating Node.js Stream Module (Readable, Transform, pipeline)
 * FSD Continuous Assessment (CA-3) | Program 3
 * Student: sukhada bhave | Roll No: 67
 */

const { Readable, Transform } = require('stream');
const fs = require('fs');

/**
 * Creates a Readable stream that formats an array of appointments into a CSV stream
 * @param {Array} appointments
 * @returns {Readable}
 */
function createAppointmentCsvStream(appointments) {
  let index = 0;
  const header = 'ID,PetName,Species,Breed,OwnerName,Phone,Email,Date,Service,Status\n';

  return new Readable({
    read() {
      if (index === 0) {
        this.push(header);
      }

      if (index < appointments.length) {
        const a = appointments[index];
        // Clean and quote CSV fields
        const row = [
          a.id,
          `"${a.petName}"`,
          `"${a.species}"`,
          `"${a.breed || ''}"`,
          `"${a.ownerName}"`,
          `"${a.ownerPhone}"`,
          `"${a.ownerEmail}"`,
          `"${a.appointmentDate}"`,
          `"${a.service}"`,
          `"${a.status}"`
        ].join(',') + '\n';

        index++;
        this.push(row);
      } else {
        // Signal EOF
        this.push(null);
      }
    }
  });
}

/**
 * Transform stream that prefixes timestamps to text chunks
 */
function createLogPrefixTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const transformed = chunk.toString();
      this.push(transformed);
      callback();
    }
  });
}

module.exports = {
  createAppointmentCsvStream,
  createLogPrefixTransform
};
