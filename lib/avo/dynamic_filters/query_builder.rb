class Avo::DynamicFilters::QueryBuilder
  attr_reader :query
  attr_reader :params
  attr_reader :resource

  def initialize(query:, params:, resource:)
    @query = query
    @params = params
    @resource = resource
    @fields = resource.get_field_definitions.select { |field| field.filterable }
  end

  def ransack_query
    return {} if parsed_params.blank?

    result = {
      m: "and"
    }.stringify_keys

    filtered_parsed_params.each do |param_filter|
      filterable_field = get_filterable_field param_filter.id

      converter = Avo::DynamicFilters::QueryConverters::BaseConverter.build(
        id: filterable_field.filterable_attributes || param_filter.id,
        field: filterable_field,
        condition: param_filter.condition,
        value: param_filter.value,
        resource: resource
      )

      result.merge!(converter.parsed)
    end

    result
  end

  def apply_custom_query(query:, query_builder: nil)
    filtered_parsed_params.each do |filter_param|
      filterable_field = get_filterable_field filter_param.id

      if !filterable_field.just_filterable? && filterable_field.filterable[:query].present?
        query = Avo::ExecutionContext.new(target: filterable_field.filterable[:query], filter_param:, parsed_params:, filterable_field:, query:, query_builder:).handle
      end
    end

    query
  end

  def apply_acts_as_taggable(query:)
    filtered_parsed_params.each do |filter_param|
      filterable_field = get_filterable_field filter_param.id

      next unless filterable_field.respond_to?(:acts_as_taggable_on) && filterable_field.acts_as_taggable_on

      inclusion = case filter_param.condition
      when "array_is"
        {match_all: true}
      when "array_contains"
        {}
      when "array_overlap"
        {any: true}
      else
        {}
      end

      query = query.tagged_with(filter_param.value.split(","), **inclusion)
    end

    query
  end

  private

  def parsed_params
    @parsed_params ||= Avo::DynamicFilters::Filter.unpack_params(params)
  end

  def filtered_parsed_params
    parsed_params
      .select do |param_filter|
        param_filter.id.in? resource.get_filterable_fields.map(&:id).map(&:to_s)
      end
  end

  def get_filterable_field(param_id)
    @fields.find { |field| field.id == param_id.to_sym }
  end
end
