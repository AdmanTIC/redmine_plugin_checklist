# Check List Plugin for Redmine

**Check List Plugin** is a plugin that extends Redmine issue management capabilities and allows you to add checklist items to each ticket.

## Table of Contents

- [Features](#Features)
- [Installation](#Installation)
  - [Steps](#Steps)
  - [Supported-versions](#Supported-versions)
- [Screenshots](#Screenshots)
- [License](#License)

## Features

- **Add checklists**: Add multiple checklist items to each issue.
- **Hierarchical structure**: Create subtasks within checklist items for hierarchical management.
- **Reordering**: Organize checklist items using drag and drop.

## Installation

### Steps

1. **Download the plugin**

    Find the Redmine plugin directory and clone it from GitHub.
   ```bash
   cd /path/to/redmine/plugins
   git clone https://github.com/shnri/redmine_plugin_checklist.git

2. **Build**
   
   Execute the build in the plugin directory.
   ```bash
   cd /path/to/redmine/plugins/check_list
   npm run build

3. **Install dependencies**(à vérifier si nécessaire)

   Install required dependencies using Bundler.
   ```bash
   bundle install

4. **Precompiling assets**
   
   Go to the Redmine root directory and precompile the assets.
   ```bash
   cd /path/to/redmine/
   bundle exec rake redmine:plugins:assets RAILS_ENV=production

5. **Database migration**

   Run the database migration.
   ```bash
   bundle exec rake redmine:plugins:migrate RAILS_ENV=production

6. **Set permissions**(à vérifier si nécessaire)

   Ensure proper permissions are set for the plugin directories.
   ```bash
   chown -R redmine:redmine /path/to/redmine/plugins/check_list   

7. **Restart Redmine**
   
   Restart the server to apply the changes.
   ```bash
   systemctl restart redmine

### Supported-versions

- **Redmine version**: `5.1.3`
- **Ruby version**: `3.1.6`

## Screenshots

![Check List](https://github.com/shnri/redmine_plugin_checklist/blob/master/img/checklist.png)

## License
This plugin is released under the MIT license. For more details, refer to the LICENSE file.
