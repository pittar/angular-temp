
export class TombstoneModel{
    constructor(
        public firstName: string,
        public lastName: string,
        public programID: number,
        public dob_string: string,
        public pob_city: string,
        public pob_province: string,
        public pob_country: string,
        public gender: string,
        public maritialStatus: string,
        public securityID: number)
    {}
}