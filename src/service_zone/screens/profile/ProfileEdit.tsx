import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../../styles/profile.styles";

type Props = {
  form: any;
  setForm: any;
  onCancel: () => void;
  onSave: () => void;
};

export default function ProfileEdit({
  form,
  setForm,
  onCancel,
  onSave,
}: Props) {
  return (
    <>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>ยกเลิก</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSave}>
          <Text style={styles.editText}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.label}>ชื่อผู้ใช้งาน</Text>
        <TextInput
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          style={styles.input}
        />

        <Text style={styles.label}>เบอร์โทร</Text>
        <TextInput
          value={form.tel}
          onChangeText={(v) => setForm({ ...form, tel: v })}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>ยานพาหนะ</Text>
        <TextInput
          value={form.vehicle}
          onChangeText={(v) => setForm({ ...form, vehicle: v })}
          style={styles.input}
        />

        <Text style={styles.label}>ประเภทงาน</Text>

        {[
          ["delivery", "ขนของ/ย้ายของ"],
          ["cleaning", "ทำความสะอาด"],
          ["other", "อื่นๆ"],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={styles.radioRow}
            onPress={() => setForm({ ...form, job_type: key })}
          >
            <Ionicons
              name={
                form.job_type === key
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color="#8C9CCE"
            />
            <Text style={styles.radioText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
