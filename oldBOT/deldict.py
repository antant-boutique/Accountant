def remove_nested_keys(dictionary, key, child):
    if key in dictionary:
        del dictionary[key][child]

    for value in dictionary.values():
        if isinstance(value, dict):
            remove_nested_keys(value, key, child)

    return dictionary


my_dict = {
    'address': {
        'country': 'Finland',
        'city': {},
    },
    'name': 'Frank',
    'age': {
        'method': 'kernel',
        'module': {},
        },
}

print(my_dict)
# {'address': {'country': 'Finland'}, 'name': 'Frank'}
print(remove_nested_keys(my_dict, 'age','module'))
