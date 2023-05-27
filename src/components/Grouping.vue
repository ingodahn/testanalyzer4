<template>
    <v-container>
        <v-row>
            <v-card class="ma-auto">
                <v-card-title>Group Settings</v-card-title>
                <v-card-actions>
                    <v-select v-model="groupSize" :items="groupSizes" :label="sizeOfGroups" />
                    <v-select v-model="groupingBy" :items="groupByItems" :label="groupStructure" v-if="groupCount > 1" />
                </v-card-actions>
                <v-card-text v-if="groupCount > 1">
                    {{ groupDescription }}
                </v-card-text>
            </v-card>
        </v-row>

        <v-row>
            <template v-for="i in groupCount">
                <v-col cols="12" md="6" lg="4" xl="3">
                    <v-card>
                        <v-card-title v-if="groupCount > 1">{{ $t('Group.h0') }} {{ i }}</v-card-title>
                        <v-card-title v-else>{{ $t('Group.h1') }}</v-card-title>
                        <v-card-subtitle>&empty; {{ avgGroupScore(groups[i - 1]) }}</v-card-subtitle>
                        <v-card-text>
                            <v-table>

                                <thead>
                                    <tr>
                                        <th v-for="header in groupHeaders" :key="header.title">
                                            <b>{{ header.title }}</b>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="student in groups[i - 1]" :key="student.name">
                                        <td>{{ student.realName }}</td>
                                        <td>{{ student.totalScore }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "Grouping",
    props: {
        Layout: {
            type: String,
            default: 'all'
        }
    },
    data() {
        return {
            grouping: [],
            groupingBy: 'similar',
            groupSize: 0,
            groupByItems: [{ title: this.$t('Group.h5'), value: 'similar' }, { title: this.$t('Group.h6'), value: 'different' }]
        }
    },
    created() {
        this.groupSize = this.studentsNr;
    },
    methods: {
        avgGroupScore(group) {
            const maxScore = Math.max(...group.map(x => x.totalScore)).toFixed(1);
            const minScore = Math.min(...group.map(x => x.totalScore)).toFixed(1);
            const avgScore = (group.reduce((a, b) => a + b.totalScore, 0) / group.length).toFixed(1);
            const sigma = Math.sqrt(group.map(x => Math.pow(x.totalScore - avgScore, 2)).reduce((a, b) => a + b, 0) / group.length).toFixed(1);
            return avgScore + ' ± ' + sigma + ' (' + minScore + ' - ' + maxScore + ')';

        },
    },
    computed: {
        studentsNr() {
            return this.scoredSorted.length;
        },
        groupSizes() {
            let itemsArray = [{ title: this.$t('Group.h7'), value: this.studentsNr }]
            for (let i = 2; 2 * i <= this.studentsNr; i++) {
                itemsArray.push({ title: i, value: i })
            }
            return itemsArray;
        },
        sizeOfGroups() {
            return this.$t('Group.size');
        },
        groupCount() {
            return Math.floor(this.studentsNr / this.groupSize);
        },
        groupDescription() {
            if (this.groupSize == this.studentsNr) return '';
            let groupCompetency = (this.groupingBy == 'similar') ? this.$t('Group.similar') : this.$t('Group.different');
            return this.$t('Group.summary', [this.groupSize, this.groupCount, groupCompetency]);
        },
        groupStructure() {
            return this.$t('Group.structure');
        },
        scoredSorted() {
            // We remove duplicate students and sort ascending by totalScore
            let myScoredSorted = [], myStudents = [], ScoredSorted = this.$root.$data.ScoredSorted;
            for (let i = ScoredSorted.length - 1; i >= 0; i--) {
                if (myStudents.indexOf(ScoredSorted[i].realName) == -1) {
                    myStudents.push(ScoredSorted[i].realName);
                    myScoredSorted.push(ScoredSorted[i]);
                }
            }
            return myScoredSorted;
        },
        groups() {
            const groups = [];
            const sn = this.studentsNr;
            const gn = this.groupCount;
            const gs = this.groupSize;
            let gr = sn % gn;
            if (this.groupSize == this.studentsNr) return [this.scoredSorted];
            if (this.groupingBy == 'similar') {
                let i = 0;
                for (let g = 0; g < gn; g++) {
                    const group = [];
                    for (let s = 0; s < gs; s++) {
                        group.push(this.scoredSorted[i]);
                        i++;
                    }
                    if (gr > 0) {
                        group.push(this.scoredSorted[i]);
                        i++;
                        gr--;
                    }
                    groups.push(group);
                }
            } else {
                for (let g = 0; g < gn; g++) {
                    const group = [];
                    for (let s = 0; s < gs; s++) {
                        group.push(this.scoredSorted[g + s * gn]);
                    }
                    groups.push(group);
                }
                for (let s = 0; s < gr; s++) {
                    groups[s].push(this.scoredSorted[gn * gs + s]);
                }
            }
            return groups;
        },
        groupHeaders() {
            return [
                { title: this.$t('Group.h2'), align: 'start', key: 'name' },
                { title: this.$t('Group.h3'), align: 'end', key: 'totalScore' },
            ]
        }
    },
}
</script>