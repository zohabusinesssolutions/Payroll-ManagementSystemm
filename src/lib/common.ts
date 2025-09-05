import moment, { Moment } from 'moment';
import _ from 'lodash';

export function encodeQueryData(formData: any) {
    formData = removeUndefinedData(formData);
    const ret: any[] = [];
    for (const d in formData)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(formData[d]));
    return ret.join('&');
}
function removeUndefinedData(query: any) {
    Object.keys(query).forEach((key) => {
        const value = typeof query[key] === 'number' ? String(query[key]) : query[key];
        if (_.isEmpty(value)) {
            delete query[key];
        }
    });

    return query;
}

export function enumerateDaysBetweenDates(startDate: Moment, endDate: Moment) {
    const currDate = moment(startDate);
    const lastDate = moment(endDate);
    const dates: Date[] = [currDate.toDate()];
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
    }

    return dates;
};

export const addLeadingNumber = ({ value, leading = 3, replacer = '0' }: { value: string; leading?: number; replacer?: string; }) => value.padStart(leading, replacer);

export const generatePassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
