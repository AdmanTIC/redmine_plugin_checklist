require_dependency File.expand_path('../app/models/issue_patch', __FILE__)

Redmine::Plugin.register :check_list do
  name 'Check List plugin'
  author 'shinri'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/shnri/redmine_plugin_checklist'
  author_url 'https://github.com/shnri'
end

# Ensure execution after Rails initialization
Rails.configuration.to_prepare do
  if Rails.configuration.respond_to?(:assets)
     # Add asset paths
    Rails.application.config.assets.paths << File.expand_path("assets/javascripts", __dir__)
    Rails.application.config.assets.paths << File.expand_path("assets/stylesheets", __dir__)

    # Specify files to be precompiled
    Rails.application.config.assets.precompile += %w(index.js index.css)
  end
end

Redmine::Hook::ViewListener.instance_eval do
  render_on :view_issues_show_description_bottom, :partial => 'plugin_folder/react_mount'
end
