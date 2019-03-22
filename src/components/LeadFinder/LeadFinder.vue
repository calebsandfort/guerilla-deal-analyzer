<template>
    <v-container fluid class="px-0 pt-0">
        <Toolbar back-path="/"></Toolbar>
        <v-content>
            <v-layout row>
                <v-flex xs12 sm8 offset-sm2>

                </v-flex>
            </v-layout>
        </v-content>
    </v-container>
</template>

<script>
    import { mapState, mapActions } from "vuex";
    import Toolbar from "../Toolbar";

    export default {
        name: "LeadFinder",
        components: {
            Toolbar
        },
        data () {
            return {
                headers: [
                    {
                        text: 'Address',
                        align: 'left',
                        sortable: false,
                        value: 'streetPlusZip'
                    },
                    {text: 'Beds', value: 'beds'},
                    {text: 'Baths', value: 'baths'},
                    {text: 'SqFt', value: 'sqft'},
                    {text: 'Price', value: 'price'}
                ]
            };
        },
        computed: {
            ...mapState({
                leadFinderStore: state => state.leadFinder
            })
        },
        methods: {
            ...mapActions({
                //fetchTeam: 'team/fetchItem'
            })
        }
    }
</script>

<style scoped>

</style>