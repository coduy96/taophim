INSERT INTO services (slug, name, description, cost_per_second, service_type, duration_config, min_duration, form_config, is_active)
VALUES (
  'chinh-sua-anh-ai',
  'Chỉnh sửa ảnh AI',
  'Chỉnh sửa và biến đổi hình ảnh bằng AI từ mô tả văn bản.',
  5,
  'image',
  NULL,
  NULL,
  '{
    "fields": [
      {
        "id": "source_image",
        "type": "image",
        "label": "Ảnh gốc",
        "placeholder": "Tải lên hình ảnh cần chỉnh sửa",
        "required": true
      },
      {
        "id": "prompt",
        "type": "textarea",
        "label": "Mô tả chỉnh sửa",
        "placeholder": "Mô tả chi tiết cách bạn muốn chỉnh sửa ảnh...",
        "required": true
      },
      {
        "id": "aspect_ratio",
        "type": "dropdown",
        "label": "Tỉ lệ khung hình",
        "placeholder": "Chọn tỉ lệ...",
        "required": false,
        "options": [
          {"value": "auto", "label": "Tự động"},
          {"value": "1:1", "label": "1:1 (Vuông)"},
          {"value": "16:9", "label": "16:9 (Ngang)"},
          {"value": "9:16", "label": "9:16 (Dọc)"},
          {"value": "4:3", "label": "4:3"},
          {"value": "3:4", "label": "3:4"},
          {"value": "3:2", "label": "3:2"},
          {"value": "2:3", "label": "2:3"}
        ]
      }
    ]
  }'::jsonb,
  true
);
