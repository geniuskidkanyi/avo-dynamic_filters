require "securerandom"

class Avo::DynamicFilters::Filter
  class << self
    def build(type:, resource_class:, field_id:)
      args = {resource_class: resource_class, field_id: field_id}

      klass = filter_for_field_type type

      klass.new(**args)
    end

    def field_to_filter(type)
      case type.to_sym
      when :boolean
        :boolean
      when :date, :date_time, :time
        :date
      when :id, :number, :progress_bar
        :number
      when :select, :badge, :country, :status
        :select
      when :text, :textarea, :code, :markdown, :password, :trix
        :text
      when :array
        :array
      when :tags
        :tags
      else
        :text
      end
    end

    def filter_for_field_type(type)
      converted_type = field_to_filter type

      "Avo::DynamicFilters::#{converted_type.to_s.camelize}Filter".safe_constantize
    end

    def icon
      raise "Not implemented."
    end

    def unpack_params(params)
      params_hash = extract_filters_from_params(params)

      return [] if params_hash.blank?

      filters = []

      params_hash.each do |id, conditions|
        conditions.each do |condition, values|
          values.each do |value|
            filters << Avo::DynamicFilters::ParamFilter.new(id: id, condition: condition, value: value)
          end
        end
      end

      filters
    end

    def extract_filters_from_params(params)
      key = Avo::DynamicFilters.configuration.param_key
      return {} if params[key].blank? || !params[key].is_a?(ActionController::Parameters) || !params[key].permit!.to_h.is_a?(Hash)

      params[key].permit!.to_h
    end
  end

  attr_reader :resource_class
  attr_reader :field_id
  attr_accessor :field
  attr_accessor :condition
  attr_accessor :value

  delegate :just_filterable?, to: :field

  def initialize(resource_class: nil, field_id: nil)
    @resource_class = resource_class
    @field_id = field_id
  end

  def partial
    self.class.to_s.underscore.downcase
  end

  def conditions
    raise "Not implemented"
  end

  # Should return a lowercased string
  # "boolean", "string", etc.
  def type
    self.class.to_s.demodulize.delete_suffix("Filter").downcase
  end

  # https://activerecord-hackery.github.io/ransack/getting-started/using-predicates/#present
  # present and blank are not supported by ransack for boolean and most fields, only for text related fields
  # $ City.all.ransack({"is_capital_present"=>1}).result.to_sql
  # => "SELECT \"cities\".* FROM \"cities\" WHERE (\"cities\".\"is_capital\" IS NOT NULL AND \"cities\".\"is_capital\" != NULL)"
  # $ City.all.ransack({"is_capital_blank"=>1}).result.to_sql
  # => "SELECT \"cities\".* FROM \"cities\" WHERE (\"cities\".\"is_capital\" IS NULL OR \"cities\".\"is_capital\" = NULL)"
  # The above SQL is not valid and will return an empty result set
  # Check https://stackoverflow.com/a/5658472/9067704 for more details
  def presence_conditions
    if nullable_field?
      return {
        is_null: "Is null",
        is_not_null: "Is not null",
      }
    end

    {}
  end

  def id
    self.class.to_s.demodulize.underscore.downcase
  end

  def unique_id
    "#{id}_#{field_id}_#{random_string}"
  end

  def random_string
    @random_string ||= SecureRandom.hex 12
  end

  def nullable_field?
    field.resource.model_class.column_for_attribute(field.id).null
  end

  def options
    field.filterable
  end
end
