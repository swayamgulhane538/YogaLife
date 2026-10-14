/**
 * YogaLife 3D Engine - CameraControls
 * Interactive touch overlay enabling camera rotation, pinch-to-zoom, and quick viewpoints.
 * Supports English & Hindi localization with the wellness design theme.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';

export type CameraViewMode = 'front' | 'side' | 'back';

export interface CameraControlsProps {
  onRotate: (deltaX: number, deltaY: number) => void;
  onZoom: (scale: number) => void;
  onResetCamera: () => void;
  onSetView: (view: CameraViewMode) => void;
  activeView?: CameraViewMode | null;
  style?: StyleProp<ViewStyle>;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onRotate,
  onZoom,
  onResetCamera,
  onSetView,
  activeView,
  style,
}) => {
  const { t } = useLanguageStore();
  const [selectedView, setSelectedView] = useState<CameraViewMode | null>(activeView || 'front');

  // Tracking refs for pan and pinch gestures
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const initialPinchDistRef = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const isMultiTouch = evt.nativeEvent.touches.length > 1;
        const isSignificantMove =
          Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
        return isMultiTouch || isSignificantMove;
      },
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { touches } = evt.nativeEvent;
        if (touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          initialPinchDistRef.current = Math.hypot(dx, dy);
        } else if (touches.length === 1) {
          lastXRef.current = touches[0].pageX;
          lastYRef.current = touches[0].pageY;
        }
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { touches } = evt.nativeEvent;

        // Two-finger pinch to zoom
        if (touches.length === 2) {
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const currentDist = Math.hypot(dx, dy);

          if (initialPinchDistRef.current && initialPinchDistRef.current > 0) {
            const scale = currentDist / initialPinchDistRef.current;
            onZoom(scale);
            initialPinchDistRef.current = currentDist; // Continuous smooth scaling
          }
        }
        // Single-finger drag to rotate camera orbit
        else if (touches.length === 1) {
          const currentX = touches[0].pageX;
          const currentY = touches[0].pageY;

          const deltaX = currentX - lastXRef.current;
          const deltaY = currentY - lastYRef.current;

          lastXRef.current = currentX;
          lastYRef.current = currentY;

          onRotate(deltaX, deltaY);
        }
      },
      onPanResponderRelease: () => {
        initialPinchDistRef.current = null;
      },
      onPanResponderTerminate: () => {
        initialPinchDistRef.current = null;
      },
    })
  ).current;

  const handleSelectView = (view: CameraViewMode) => {
    setSelectedView(view);
    onSetView(view);
  };

  const handleReset = () => {
    setSelectedView('front');
    onResetCamera();
  };

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      {/* Pan & Pinch Touch Surface */}
      <View style={styles.touchSurface} {...panResponder.panHandlers} />

      {/* Floating Quick View Capsule Bar */}
      <View style={styles.quickViewBarContainer} pointerEvents="box-none">
        <View style={styles.quickViewBar}>
          {/* Front View */}
          <TouchableOpacity
            style={[
              styles.capsuleBtn,
              selectedView === 'front' && styles.capsuleBtnActive,
            ]}
            onPress={() => handleSelectView('front')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="eye-outline"
              size={15}
              color={selectedView === 'front' ? Colors.cardBg : Colors.deepForest}
            />
            <Text
              style={[
                styles.btnText,
                selectedView === 'front' && styles.btnTextActive,
              ]}
            >
              {t('Front', 'सामने')}
            </Text>
          </TouchableOpacity>

          {/* Side View */}
          <TouchableOpacity
            style={[
              styles.capsuleBtn,
              selectedView === 'side' && styles.capsuleBtnActive,
            ]}
            onPress={() => handleSelectView('side')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="swap-horizontal"
              size={15}
              color={selectedView === 'side' ? Colors.cardBg : Colors.deepForest}
            />
            <Text
              style={[
                styles.btnText,
                selectedView === 'side' && styles.btnTextActive,
              ]}
            >
              {t('Side', 'बगल')}
            </Text>
          </TouchableOpacity>

          {/* Back View */}
          <TouchableOpacity
            style={[
              styles.capsuleBtn,
              selectedView === 'back' && styles.capsuleBtnActive,
            ]}
            onPress={() => handleSelectView('back')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="return-down-back"
              size={15}
              color={selectedView === 'back' ? Colors.cardBg : Colors.deepForest}
            />
            <Text
              style={[
                styles.btnText,
                selectedView === 'back' && styles.btnTextActive,
              ]}
            >
              {t('Back', 'पीछे')}
            </Text>
          </TouchableOpacity>

          {/* Reset Camera */}
          <TouchableOpacity
            style={[styles.capsuleBtn, styles.resetBtn]}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={15} color={Colors.mutedGold} />
            <Text style={[styles.btnText, styles.resetText]}>
              {t('Reset', 'रीसेट')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  touchSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  quickViewBarContainer: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  quickViewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(143, 188, 143, 0.45)',
    ...Shadows.sm,
  },
  capsuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginHorizontal: 3,
  },
  capsuleBtnActive: {
    backgroundColor: Colors.deepForest,
  },
  resetBtn: {
    backgroundColor: 'rgba(255, 248, 220, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
    marginLeft: 4,
  },
  btnTextActive: {
    color: Colors.cardBg,
  },
  resetText: {
    color: Colors.mutedGold,
  },
});

export default CameraControls;
