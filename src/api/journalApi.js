import axios from 'axios'

const journalApi = axios.create({
    baseURL: 'https://vue-journal-73f9c-default-rtdb.firebaseio.com'
})

export default journalApi