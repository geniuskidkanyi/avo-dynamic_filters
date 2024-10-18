require_relative "lib/avo/dynamic_filters/version"
#require_relative "../avo/lib/avo/version"

Gem::Specification.new do |spec|
  spec.name = "avo-dynamic_filters"
  spec.version = Avo::DynamicFilters::VERSION
  spec.authors = ["Adrian"]
  spec.email = ["adrian@adrianthedev.com"]
  spec.homepage = "https://avohq.io"
  spec.summary = "Dynamic filters for Avo."
  spec.description = "Dynamic filters for Avo."
  spec.license = "Commercial"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://rubygems.pkg.github.com/avo-hq"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/avo-hq/avo"
  spec.metadata["changelog_uri"] = "https://github.com/avo-hq/avo"

  spec.files = Dir["{app,config,db,lib}/**/*", "Rakefile", "README.md", "avo-dynamic_filters.gemspec"]
  spec.files -= Dir["{app/javascript}/**/*"]

  spec.add_dependency "zeitwerk", ">= 2.6.12"
  spec.add_dependency "avo", ">= 3.5.1"
  spec.add_dependency "view_component", ">= 3.7.0"
  spec.add_dependency "ransack", ">= 4.1.1"
end
