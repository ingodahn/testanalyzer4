<template>
    <p>
        {{ $t("Test.p1") }}
    </p>
    <p>
        {{ $t("Test.p2") }}
    </p>
    <p>
        <b>{{ $t("Test.p3b") }}</b>
        {{ $t("Test.p3") }} (
        <a href="https://de.wikipedia.org/wiki/Edge_Computing" target="_blank">Edge Computing</a>)
    </p>
    <p v-html="$t('Test.p4')"></p>
</template>