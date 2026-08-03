-- Canvas Review System Database Schema Extension

CREATE TABLE IF NOT EXISTS clients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  designer_id BIGINT UNSIGNED NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_clients_designer_id (designer_id),
  CONSTRAINT fk_clients_designer FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id BIGINT UNSIGNED NOT NULL,
  designer_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'in_review', 'changes_requested', 'approved') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_projects_client_id (client_id),
  KEY idx_projects_designer_id (designer_id),
  CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  CONSTRAINT fk_projects_designer FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS diagram_templates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  preview_url TEXT NULL,
  template_structure JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS canvases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  canvas_type ENUM('individual', 'collage', 'diagram') NOT NULL,
  diagram_template_id BIGINT UNSIGNED NULL,
  watermark_enabled TINYINT(1) NOT NULL DEFAULT 1,
  watermark_text VARCHAR(255) NULL,
  status ENUM('pending_review', 'reviewed', 'changes_requested', 'approved') NOT NULL DEFAULT 'pending_review',
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_canvases_project_id (project_id),
  KEY idx_canvases_diagram_template (diagram_template_id),
  CONSTRAINT fk_canvases_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_canvases_diagram FOREIGN KEY (diagram_template_id) REFERENCES diagram_templates(id) ON DELETE SET NULL,
  CONSTRAINT fk_canvases_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS canvas_versions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  canvas_id BIGINT UNSIGNED NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  original_image_url TEXT NOT NULL,
  watermarked_image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  metadata JSON NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_versions_canvas_id (canvas_id),
  CONSTRAINT fk_versions_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
  CONSTRAINT fk_versions_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_shares (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  share_token VARCHAR(100) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_shares_token (share_token),
  KEY idx_project_shares_project (project_id),
  CONSTRAINT fk_project_shares_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_shares_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS canvas_remarks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  canvas_id BIGINT UNSIGNED NOT NULL,
  version_id BIGINT UNSIGNED NOT NULL,
  image_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  user_name VARCHAR(255) NULL,
  remark TEXT NOT NULL,
  status_action ENUM('approved', 'changes_requested', 'comment') NOT NULL DEFAULT 'comment',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_remarks_canvas_id (canvas_id),
  KEY idx_remarks_version_id (version_id),
  KEY idx_remarks_image_id (image_id),
  CONSTRAINT fk_remarks_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
  CONSTRAINT fk_remarks_version FOREIGN KEY (version_id) REFERENCES canvas_versions(id) ON DELETE CASCADE,
  CONSTRAINT fk_remarks_image FOREIGN KEY (image_id) REFERENCES diagram_images(id) ON DELETE CASCADE,
  CONSTRAINT fk_remarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS canvas_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  canvas_id BIGINT UNSIGNED NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  actor_name VARCHAR(255) NULL,
  old_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_history_canvas_id (canvas_id),
  CONSTRAINT fk_history_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS diagram_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  canvas_id BIGINT UNSIGNED NOT NULL,
  version_id BIGINT UNSIGNED NOT NULL,
  original_image_url TEXT NOT NULL,
  watermarked_image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  caption VARCHAR(255) NULL,
  status ENUM('pending_review', 'approved', 'changes_requested') NOT NULL DEFAULT 'pending_review',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_diagram_images_canvas (canvas_id),
  KEY idx_diagram_images_version (version_id),
  CONSTRAINT fk_diagram_images_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
  CONSTRAINT fk_diagram_images_version FOREIGN KEY (version_id) REFERENCES canvas_versions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
