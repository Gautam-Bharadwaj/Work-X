import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, StatusBar, Animated,
} from 'react-native';

const colors = {
  background: '#020617', surface: '#0B1120', surfaceAlt: '#111827', primary: '#22D3EE', primaryAlt: '#4F46E5', textPrimary: '#F9FAFB', textSecondary: '#9CA3AF', textMuted: '#6B7280', borderSubtle: '#1F2937',
};

const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
