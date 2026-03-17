
export type ImageMap = {
    [key: string]: any;
  };

  
const images : ImageMap= {
    doctor: require('./doctor.png'),
    boy: require('./boy.png'),
    docDashBg: require('./docDashBg.png'),
    doctorBg: require('./docBg.png'),
    patientBg:  require('./docAndHospital.jpg'),
    indianFlag: require('./indianFlag.png'),
    femaleDoctor: require('./femaleDoctor.png'),
  };
  
  export default images;