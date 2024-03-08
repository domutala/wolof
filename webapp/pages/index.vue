<script lang="ts" setup>
const { t } = useI18n({ useScope: "local" });

useSeoMeta({
  title: t("title"),
  ogTitle: t("title"),
  description: t("description"),
  ogDescription: t("description"),
});
</script>

<i18n lang="json" src="./index.lang.json"></i18n>

<template>
  <v-container>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis iste,
    illum architecto, ullam quos velit blanditiis non nostrum ex vitae rerum
    quas debitis nam. Maxime aut officia totam soluta! Officiis.

    <ui-new />
  </v-container>
</template>
