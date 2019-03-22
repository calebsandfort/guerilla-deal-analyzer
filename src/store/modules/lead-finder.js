import {apolloClient} from "../../apollo"
import * as propertyApi from "../../api/property"

const state = {
    list: [{
        "zillow_propertyId": 53917319,
        "zillow_path": "/homedetails/3521-N-Michigan-Ave-Portland-OR-97227/53917319_zpid/",
        "zillow_url": "https://www.zillow.com/homedetails/3521-N-Michigan-Ave-Portland-OR-97227/53917319_zpid/?fullpage=true",
        "streetAddress": "3521 N Michigan Ave",
        "city": "Portland",
        "state": "OR",
        "zipcode": "97227",
        "fullAddress": "3521 N Michigan Ave, Portland, OR 97227",
        "streetPlusZip": "3521 N Michigan Ave, 97227",
        "price": 199900,
        "sqft": 1201,
        "beds": 2,
        "baths": 1,
        "description": "Location cannot be beat on this adorable home just off Mississippi in the heart of PDX. You'll love the access to dining, music, and shopping, the high ceilings, bay window, single floor layout, and oodles of potential. Alley access for parking. This is your chance to invest in inner PDX-come and make this home your own!",
        "zillow_imageUrl": "https://photos.zillowstatic.com/p_d/ISqxianm3vi0rh0000000000.jpg"
    },
        {
            "zillow_propertyId": 53841952,
            "zillow_path": "/homedetails/4603-N-Kerby-Ave-Portland-OR-97217/53841952_zpid/",
            "zillow_url": "https://www.zillow.com/homedetails/4603-N-Kerby-Ave-Portland-OR-97217/53841952_zpid/?fullpage=true",
            "streetAddress": "4603 N Kerby Ave",
            "city": "Portland",
            "state": "OR",
            "zipcode": "97217",
            "fullAddress": "4603 N Kerby Ave, Portland, OR 97217",
            "streetPlusZip": "4603 N Kerby Ave, 97217",
            "price": 449000,
            "sqft": 905,
            "beds": 3,
            "baths": 1,
            "description": "4603 N Kerby Ave, Portland, OR is a single family home that contains 905 sq ft and was built in 1954. It contains 3 bedrooms and 1 bathroom. This home last sold for $449,000 in November 2018. \n \nThe Zestimate for this house is $449,082, which has decreased by $1,116 in the last 30 days. The Rent Zestimate for this home is $1,950/mo, which has increased by $120/mo in the last 30 days. ",
            "zillow_imageUrl": "https://photos.zillowstatic.com/p_d/ISqp4az5h2y38b1000000000.jpg"
        }]
}

const getters = {
    count: function (state) {
        return state.list.length;
    }
}

export const mutations = {
    setList(state, list){
        state.list = list;
    },
}

export const actions = {
    async fetchList({ commit }, requestVariables){
        const response = await propertyApi.getAll(apolloClient, requestVariables);
        commit('setList', response.data.properties);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}