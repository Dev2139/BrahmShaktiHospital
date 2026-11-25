import cv2
import numpy as np
import math

W, H = 2560, 1440

# Colors (BGR)
C_WHITE = np.array([255, 255, 255], dtype=np.float32)
C_ICE = np.array([250, 248, 235], dtype=np.float32)       # #EBF8FA
C_SOFT_CYAN = np.array([250, 245, 206], dtype=np.float32) # #CEF5FA
C_VIBRANT = np.array([213, 175, 13], dtype=np.float32)    # #0DAFD5
C_DEEP = np.array([174, 138, 1], dtype=np.float32)        # #018AAE

# 1. Coordinate grids with shape (H, W, 1)
y_idx, x_idx = np.mgrid[0:H, 0:W].astype(np.float32)
nx = (x_idx / float(W))[:, :, None]
ny = (y_idx / float(H))[:, :, None]

# 2. Smooth ambient background canvas
canvas = C_WHITE * (1.0 - 0.25 * nx) + C_ICE * (0.25 * nx)

# Add soft radial glow in top right where stethoscope sits
dist_tr = np.sqrt((nx - 0.85)**2 + (ny - 0.2)**2)
glow_tr = np.clip(1.0 - dist_tr / 0.75, 0.0, 1.0) ** 1.5
canvas = canvas * (1.0 - 0.35 * glow_tr) + C_SOFT_CYAN * (0.35 * glow_tr)

# 3. Wave curves at bottom
wave_bottom_y = (H * 0.82 + np.sin(nx[:, :, 0] * 3.0 - 0.4) * 80.0 + np.cos(nx[:, :, 0] * 1.5) * 40.0)[:, :, None]
prog_bottom = np.clip((y_idx[:, :, None] - wave_bottom_y) / (H - wave_bottom_y + 1e-5), 0.0, 1.0)
mask_bottom = (y_idx[:, :, None] >= wave_bottom_y).astype(np.float32) * (prog_bottom ** 0.8)

wave_color = C_DEEP * 0.4 + C_VIBRANT * 0.6
canvas = canvas * (1.0 - 0.5 * mask_bottom) + wave_color * (0.5 * mask_bottom)

# 4. Extract and seamlessly blend stethoscope
# Source: ref-steth-full.jpg from user uploaded media
steth_src = cv2.imread('client/public/ref-steth-full.jpg')
if steth_src is None:
    steth_src = cv2.imread('client/public/ref-steth2.jpg')

if steth_src is not None:
    # Target size: 900x580
    target_w = 900
    target_h = int(target_w * steth_src.shape[0] / steth_src.shape[1])
    steth_resized = cv2.resize(steth_src, (target_w, target_h), interpolation=cv2.INTER_CUBIC)
    
    # Target position: top right quadrant
    pos_x = W - target_w - 40
    pos_y = 50
    
    # Create smooth feathered alpha mask for seamless blending
    steth_mask = np.ones((target_h, target_w), dtype=np.float32)
    feather = 70
    steth_mask[:feather, :] *= np.linspace(0, 1, feather)[:, None]
    steth_mask[-feather:, :] *= np.linspace(1, 0, feather)[:, None]
    steth_mask[:, :feather] *= np.linspace(0, 1, feather)[None, :]
    steth_mask[:, -feather:] *= np.linspace(1, 0, feather)[None, :]
    steth_mask = cv2.GaussianBlur(steth_mask, (65, 65), 0)
    
    steth_float = steth_resized.astype(np.float32)
    
    # Composite into canvas
    patch = canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w]
    alpha_3d = steth_mask[:, :, None] * 0.85
    canvas[pos_y:pos_y+target_h, pos_x:pos_x+target_w] = patch * (1.0 - alpha_3d) + steth_float * alpha_3d

# 5. Add smooth subtle ECG pulse line in middle-right
ecg_y = int(H * 0.38)
ecg_pts = []
for x in range(int(W * 0.62), W - 80, 2):
    t = (x - int(W * 0.62)) / float(W * 0.38)
    y_offset = 0.0
    if 0.4 < t < 0.6:
        phase = (t - 0.4) / 0.2
        if phase < 0.2:
            y_offset = -15 * math.sin(phase * 5 * math.pi)
        elif phase < 0.5:
            y_offset = 55 * math.sin((phase - 0.2) * 3.33 * math.pi)
        elif phase < 0.7:
            y_offset = -35 * math.sin((phase - 0.5) * 5 * math.pi)
        else:
            y_offset = 12 * math.sin((phase - 0.7) * 3.33 * math.pi)
    ecg_pts.append((x, int(ecg_y + y_offset)))

if len(ecg_pts) > 1:
    canvas_uint8 = np.clip(canvas, 0, 255).astype(np.uint8)
    for i in range(len(ecg_pts) - 1):
        cv2.line(canvas_uint8, ecg_pts[i], ecg_pts[i+1], (213, 175, 13), 2, cv2.LINE_AA)
    ecg_glow = cv2.GaussianBlur(canvas_uint8, (9, 9), 0)
    canvas = canvas * 0.94 + ecg_glow.astype(np.float32) * 0.06

# Save final result
final_bg = np.clip(canvas, 0, 255).astype(np.uint8)
cv2.imwrite('client/public/hospital-waves-stethoscope-bg.jpg', final_bg, [cv2.IMWRITE_JPEG_QUALITY, 96])
print('Successfully generated client/public/hospital-waves-stethoscope-bg.jpg!')
