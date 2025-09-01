import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export const useDateService = () => {
    const NOW = dayjs(new Date());

    /**
     * Does the input date reside in between the start and end of the given year and month?
     * @param input
     * @param year -> number
     * @param month -> number
     * @returns {boolean}
     */
    function isInYearMonth(input, year, month) {
        const inputAsString = dayjs(input).format('YYYY-MM-DD');
        const date = dayjs(inputAsString);
        const start = dayjs(`${year}-${getValidMonthString(month)}-01`);
        const end = start.endOf('month');

        return date.isBetween(start, end, 'month', '[]');
    }

    /**
     * Is the input date today?
     * @param input
     * @returns {boolean}
     */
    function isToday(input) {
        const date = dayjs(input);

        return date.isSame(NOW, 'day');
    }

    function getValidMonthString(month) {
        let result;
        switch (parseInt(month)) {
            case 1:
                result = '01';
                break;
            case 2:
                result = '02';
                break;
            case 3:
                result = '03';
                break;
            case 4:
                result = '04';
                break;
            case 5:
                result = '05';
                break;
            case 6:
                result = '06';
                break;
            case 7:
                result = '07';
                break;
            case 8:
                result = '08';
                break;
            case 9:
                result = '09';
                break;
            case 10:
                result = '10';
                break;
            case 11:
                result = '11';
                break;
            case 12:
                result = '12';
                break;
            default:
                result = month
        }

        return result;
    }

    function getMonthAsString(month) {
        let result;
        switch (parseInt(month)) {
            case 1:
                result = 'Januar';
                break;
            case 2:
                result = 'Februar';
                break;
            case 3:
                result = 'März';
                break;
            case 4:
                result = 'April';
                break;
            case 5:
                result = 'Mai';
                break;
            case 6:
                result = 'Juni';
                break;
            case 7:
                result = 'Juli';
                break;
            case 8:
                result = 'August';
                break;
            case 9:
                result = 'September';
                break;
            case 10:
                result = 'Oktober';
                break;
            case 11:
                result = 'November';
                break;
            case 12:
                result = 'Dezember';
                break;
            default:
                result = "ERROR"
        }

        return result;
    }

    /**
     * Does the input date reside in between the start and end of the given year?
     * @param input
     * @param year
     * @returns {boolean}
     */
    function isInYear(input, year) {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        const date = dayjs(input);
        return date.isBetween(dayjs(start), dayjs(end), 'day', '[]');
    }

    return {
        isInYear,
        isInYearMonth,
        isToday,
        getMonthAsString,
        NOW
    };
};
