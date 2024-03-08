<script lang="ts" setup>
import { mergeProps } from "vue";

const emit = defineEmits<{ (e: "added", word: any): void }>();

const isOpen = ref(false);
const isValid = ref(false);
const isAdded = ref(false);
const isSubmitting = ref(false);
const data = ref({ writting: "", definition: "" });

async function submit() {
  if (isSubmitting.value) return;
  if (!isValid.value) return;

  isSubmitting.value;
  try {
    const word = await Api.fetch({
      url: "/word/new",
      method: "POST",
      body: data.value,
    });
    isOpen.value = false;
    emit("added", word);

    isAdded.value = true;
    setTimeout(() => (isAdded.value = false), 5000);
  } finally {
    isSubmitting.value = false;
  }
}

watch(
  () => isOpen.value,
  () => {
    if (!isOpen.value || isSubmitting.value) return;
    data.value = { writting: "", definition: "" };
  }
);
</script>

<template>
  <v-dialog width="600" v-model="isOpen" persistent>
    <template #activator="{ props: dialogProps }">
      <v-tooltip
        text="Yokk al baat"
        :content-props="{ class: 'bg-dark rounded-pill' }"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="!$slots.activator"
            v-bind="mergeProps(dialogProps, props)"
            size="small"
            variant="elevated"
            tooltip="heel"
            style="position: fixed; bottom: 20px; right: 20px; z-index: 100"
            elevation-10
            icon
          >
            <i class="fi fi-br-plus"></i>
          </v-btn>

          <!-- <v-btn v-bind="props">Tooltip</v-btn> -->
        </template>
      </v-tooltip>

      <slot name="activator" :props="dialogProps" />
    </template>
    <v-card>
      <v-form class="mt-5" v-model="isValid" @submit.prevent="submit">
        <v-container>
          <v-text-field
            label="Ni nu koy binde"
            required
            v-model="data.writting"
            hide-details="auto"
            :rules="[(value) => !!value || 'Field is required']"
          ></v-text-field>
          <v-textarea
            label="Lu muy tekki"
            hide-details="auto"
            class="mt-2"
            v-model="data.definition"
          ></v-textarea>
        </v-container>

        <div style="position: sticky; bottom: 0" class="border-t">
          <v-container>
            <v-btn
              color="dark"
              variant="tonal"
              class="mr-2"
              :disabled="isSubmitting"
              @click="isOpen = false"
              >Bayyi</v-btn
            >
            <v-btn type="submit" :loading="isSubmitting">Rënk</v-btn>
          </v-container>
        </div>
      </v-form>
    </v-card>
  </v-dialog>

  <v-snackbar :model-value="isAdded" color="success">
    Baat bi di « <b> {{ data.writting }}</b> » yokk u na nu ko ci baatikaay bi
  </v-snackbar>
</template>
